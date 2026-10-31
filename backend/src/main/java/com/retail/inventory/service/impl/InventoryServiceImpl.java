package com.retail.inventory.service.impl;

import com.retail.inventory.dto.request.*;
import com.retail.inventory.dto.response.*;
import com.retail.inventory.entity.*;
import com.retail.inventory.entity.enums.*;
import com.retail.inventory.exception.*;
import com.retail.inventory.repository.*;
import com.retail.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class InventoryServiceImpl implements InventoryService {
 private final InventoryRepository inventoryRepository; private final ProductRepository productRepository; private final WarehouseRepository warehouseRepository; private final StockTransactionRepository transactionRepository; private final StockTransferRepository transferRepository; private final StockAlertRepository alertRepository;
 public Page<InventoryResponse> findAll(String q, Long p, Long w, Pageable pageable) { return inventoryRepository.search(norm(q),p,w,pageable).map(this::inventoryResponse); }
 public InventoryResponse findById(Long id) { return inventoryResponse(inventoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Inventory", "id", id))); }
 public List<InventoryResponse> lowStock() { return inventoryRepository.findLowStockInventory().stream().map(this::inventoryResponse).toList(); }
 public List<StockAlertResponse> activeAlerts() { return alertRepository.findByStatus(StockAlertStatus.ACTIVE).stream().map(this::alertResponse).toList(); }
 @Transactional public StockTransactionResponse adjust(StockAdjustmentRequest r) {
   Inventory i=lockedInventory(r.getProductId(),r.getWarehouseId()); int before=i.getQuantityOnHand(); int after=before+r.getQuantityChange(); if(after<0) throw new InsufficientStockException("Adjustment would make stock negative"); i.setQuantityOnHand(after); inventoryRepository.save(i); StockTransaction t=record(i,TransactionType.STOCK_ADJUSTMENT,r.getQuantityChange(),before,after,r.getReason(),null,r.getPerformedBy()); updateAlert(i); return transactionResponse(t);
 }
 @Transactional public StockTransferResponse transfer(StockTransferRequest r) {
   if(r.getFromWarehouseId().equals(r.getToWarehouseId())) throw new BadRequestException("Source and destination warehouses must differ");
   Inventory source=lockedInventory(r.getProductId(),r.getFromWarehouseId()); if(source.getQuantityAvailable()<r.getQuantity()) throw new InsufficientStockException("Insufficient available stock for transfer");
   Product product=source.getProduct(); Warehouse destinationWarehouse=warehouse(r.getToWarehouseId());
   Inventory dest=inventoryRepository.findByProductIdAndWarehouseIdForUpdate(r.getProductId(),r.getToWarehouseId()).orElseGet(() -> inventoryRepository.save(Inventory.builder().product(product).warehouse(destinationWarehouse).quantityOnHand(0).quantityReserved(0).build()));
   int sourceBefore=source.getQuantityOnHand(), destBefore=dest.getQuantityOnHand(); source.setQuantityOnHand(sourceBefore-r.getQuantity()); dest.setQuantityOnHand(destBefore+r.getQuantity()); inventoryRepository.save(source); inventoryRepository.save(dest);
   String ref="TRF-"+UUID.randomUUID(); StockTransfer transfer=transferRepository.save(StockTransfer.builder().product(product).fromWarehouse(source.getWarehouse()).toWarehouse(destinationWarehouse).quantity(r.getQuantity()).notes(norm(r.getNotes())).performedBy(defaulted(r.getPerformedBy())).referenceNumber(ref).build());
   record(source,TransactionType.TRANSFER_OUT,-r.getQuantity(),sourceBefore,source.getQuantityOnHand(),r.getNotes(),ref,r.getPerformedBy()); record(dest,TransactionType.TRANSFER_IN,r.getQuantity(),destBefore,dest.getQuantityOnHand(),r.getNotes(),ref,r.getPerformedBy()); updateAlert(source); updateAlert(dest); return transferResponse(transfer);
 }
 public Page<StockTransferResponse> transfers(Pageable pageable) { return transferRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::transferResponse); }
 public StockTransferResponse transferById(Long id) { return transferResponse(transferRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Stock transfer","id",id))); }
 public Page<StockTransactionResponse> transactions(Pageable pageable) { return transactionRepository.findAllWithDetails(pageable).map(this::transactionResponse); }
 public StockTransactionResponse transactionById(Long id) { return transactionResponse(transactionRepository.findByIdWithDetails(id).orElseThrow(() -> new ResourceNotFoundException("Stock transaction","id",id))); }
 private Inventory lockedInventory(Long p,Long w) { return inventoryRepository.findByProductIdAndWarehouseIdForUpdate(p,w).orElseThrow(() -> new ResourceNotFoundException("Inventory", "product/warehouse", p+"/"+w)); }
 private Warehouse warehouse(Long id) { return warehouseRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Warehouse","id",id)); }
 private StockTransaction record(Inventory i, TransactionType type,int qty,int before,int after,String notes,String ref,String actor) { return transactionRepository.save(StockTransaction.builder().transactionCode("TX-"+UUID.randomUUID()).product(i.getProduct()).warehouse(i.getWarehouse()).transactionType(type).quantity(qty).previousQuantity(before).newQuantity(after).notes(norm(notes)).referenceNumber(ref).performedBy(defaulted(actor)).build()); }
 private void updateAlert(Inventory i) { int available=i.getQuantityAvailable(), threshold=i.getProduct().getReorderPoint(); Optional<StockAlert> existing=alertRepository.findByProductIdAndWarehouseIdAndStatus(i.getProduct().getId(),i.getWarehouse().getId(),StockAlertStatus.ACTIVE); if(available<=threshold) { StockAlert a=existing.orElseGet(()->StockAlert.builder().product(i.getProduct()).warehouse(i.getWarehouse()).alertType(available==0?StockAlertType.OUT_OF_STOCK:StockAlertType.REORDER_POINT_REACHED).status(StockAlertStatus.ACTIVE).build()); a.setCurrentQuantity(available);a.setThresholdQuantity(threshold);a.setAlertType(available==0?StockAlertType.OUT_OF_STOCK:StockAlertType.REORDER_POINT_REACHED);alertRepository.save(a); } else existing.ifPresent(a->{a.setStatus(StockAlertStatus.RESOLVED);a.setResolvedAt(LocalDateTime.now());alertRepository.save(a);}); }
 private InventoryResponse inventoryResponse(Inventory i) { return InventoryResponse.builder().id(i.getId()).productId(i.getProduct().getId()).productSku(i.getProduct().getSku()).productName(i.getProduct().getName()).warehouseId(i.getWarehouse().getId()).warehouseCode(i.getWarehouse().getWarehouseCode()).warehouseName(i.getWarehouse().getName()).quantityOnHand(i.getQuantityOnHand()).quantityReserved(i.getQuantityReserved()).quantityAvailable(i.getQuantityAvailable()).binLocation(i.getBinLocation()).reorderPoint(i.getProduct().getReorderPoint()).isLowStock(i.getQuantityAvailable()<=i.getProduct().getReorderPoint()).lastCountedAt(i.getLastCountedAt()).updatedAt(i.getUpdatedAt()).build(); }
 private StockTransactionResponse transactionResponse(StockTransaction t) { return StockTransactionResponse.builder().id(t.getId()).transactionCode(t.getTransactionCode()).productId(t.getProduct().getId()).productSku(t.getProduct().getSku()).warehouseId(t.getWarehouse().getId()).warehouseCode(t.getWarehouse().getWarehouseCode()).transactionType(t.getTransactionType()).quantity(t.getQuantity()).previousQuantity(t.getPreviousQuantity()).newQuantity(t.getNewQuantity()).reason(t.getNotes()).referenceNumber(t.getReferenceNumber()).performedBy(t.getPerformedBy()).createdAt(t.getCreatedAt()).build(); }
 private StockTransferResponse transferResponse(StockTransfer t) { return StockTransferResponse.builder().id(t.getId()).referenceNumber(t.getReferenceNumber()).productId(t.getProduct().getId()).productSku(t.getProduct().getSku()).fromWarehouseId(t.getFromWarehouse().getId()).fromWarehouseCode(t.getFromWarehouse().getWarehouseCode()).toWarehouseId(t.getToWarehouse().getId()).toWarehouseCode(t.getToWarehouse().getWarehouseCode()).quantity(t.getQuantity()).notes(t.getNotes()).performedBy(t.getPerformedBy()).createdAt(t.getCreatedAt()).build(); }
 private StockAlertResponse alertResponse(StockAlert a) { return StockAlertResponse.builder().id(a.getId()).productId(a.getProduct().getId()).productSku(a.getProduct().getSku()).warehouseId(a.getWarehouse().getId()).warehouseCode(a.getWarehouse().getWarehouseCode()).alertType(a.getAlertType()).currentQuantity(a.getCurrentQuantity()).thresholdQuantity(a.getThresholdQuantity()).build(); }
 private String norm(String v){if(v==null)return null;String n=v.trim();return n.isEmpty()?null:n;} private String defaulted(String v){String n=norm(v);return n==null?"SYSTEM":n;}
}
