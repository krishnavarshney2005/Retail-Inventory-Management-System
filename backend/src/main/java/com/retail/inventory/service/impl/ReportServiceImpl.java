package com.retail.inventory.service.impl;

import com.retail.inventory.dto.response.ReportResponse;
import com.retail.inventory.entity.Inventory;
import com.retail.inventory.repository.*;
import com.retail.inventory.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {
    private final InventoryRepository inventory; private final OrderRepository orders; private final StockTransactionRepository transactions;
    public ReportResponse getReport(Long warehouseId, Long productId, LocalDate fromDate, LocalDate toDate) {
        var rows = inventory.findAllWithProductAndWarehouse().stream().filter(i -> warehouseId == null || i.getWarehouse().getId().equals(warehouseId)).filter(i -> productId == null || i.getProduct().getId().equals(productId)).map(this::inventoryRow).toList();
        var orderRows = orders.findAllWithDetails().stream().filter(o -> (fromDate == null || !o.getOrderDate().isBefore(fromDate)) && (toDate == null || !o.getOrderDate().isAfter(toDate))).filter(o -> warehouseId == null || o.getWarehouse().getId().equals(warehouseId)).map(o -> new ReportResponse.OrderRow(o.getId(), o.getOrderNumber(), o.getStatus().name(), o.getOrderType().name(), o.getWarehouse().getName(), o.getSupplier() == null ? null : o.getSupplier().getCompanyName(), o.getTotalAmount(), o.getOrderDate())).toList();
        var movementRows = transactions.findRecentTransactions().stream().filter(t -> warehouseId == null || t.getWarehouse().getId().equals(warehouseId)).filter(t -> productId == null || t.getProduct().getId().equals(productId)).filter(t -> fromDate == null || !t.getCreatedAt().toLocalDate().isBefore(fromDate)).filter(t -> toDate == null || !t.getCreatedAt().toLocalDate().isAfter(toDate)).map(t -> new ReportResponse.TransactionRow(t.getId(), t.getTransactionCode(), t.getTransactionType().name(), t.getProduct().getName(), t.getWarehouse().getName(), t.getQuantity(), t.getPreviousQuantity(), t.getNewQuantity(), t.getNotes(), t.getCreatedAt())).toList();
        return new ReportResponse(rows, orderRows, movementRows, rows.stream().map(ReportResponse.InventoryRow::value).reduce(BigDecimal.ZERO, BigDecimal::add));
    }
    private ReportResponse.InventoryRow inventoryRow(Inventory i) { BigDecimal cost = i.getProduct().getCostPrice() == null ? BigDecimal.ZERO : i.getProduct().getCostPrice(); BigDecimal value = cost.multiply(BigDecimal.valueOf(i.getQuantityOnHand() == null ? 0 : i.getQuantityOnHand())); return new ReportResponse.InventoryRow(i.getProduct().getId(), i.getProduct().getSku(), i.getProduct().getName(), i.getWarehouse().getId(), i.getWarehouse().getName(), i.getQuantityOnHand(), i.getQuantityReserved(), i.getQuantityAvailable(), i.getProduct().getReorderPoint(), i.getQuantityAvailable() <= i.getProduct().getReorderPoint(), cost, value); }
}
