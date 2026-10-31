package com.retail.inventory.service.impl;

import com.retail.inventory.dto.request.WarehouseRequest;
import com.retail.inventory.dto.response.WarehouseResponse;
import com.retail.inventory.entity.Warehouse;
import com.retail.inventory.exception.BadRequestException;
import com.retail.inventory.exception.DuplicateResourceException;
import com.retail.inventory.exception.ResourceNotFoundException;
import com.retail.inventory.repository.InventoryRepository;
import com.retail.inventory.repository.OrderRepository;
import com.retail.inventory.repository.StockTransactionRepository;
import com.retail.inventory.repository.WarehouseRepository;
import com.retail.inventory.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WarehouseServiceImpl implements WarehouseService {
    private final WarehouseRepository warehouseRepository;
    private final InventoryRepository inventoryRepository;
    private final StockTransactionRepository stockTransactionRepository;
    private final OrderRepository orderRepository;

    public Page<WarehouseResponse> findAll(String query, Pageable pageable) {
        return warehouseRepository.search(normalize(query), pageable).map(this::toResponse);
    }
    public WarehouseResponse findById(Long id) { return toResponse(find(id)); }

    @Transactional
    public WarehouseResponse create(WarehouseRequest request) {
        String code = required(request.getWarehouseCode());
        if (warehouseRepository.existsByWarehouseCode(code)) throw new DuplicateResourceException("Warehouse code already exists: " + code);
        Warehouse warehouse = new Warehouse();
        apply(warehouse, request, code);
        return toResponse(warehouseRepository.save(warehouse));
    }

    @Transactional
    public WarehouseResponse update(Long id, WarehouseRequest request) {
        Warehouse warehouse = find(id);
        String code = required(request.getWarehouseCode());
        if (warehouseRepository.existsByWarehouseCodeAndIdNot(code, id)) throw new DuplicateResourceException("Warehouse code already exists: " + code);
        apply(warehouse, request, code);
        return toResponse(warehouseRepository.save(warehouse));
    }

    @Transactional
    public void delete(Long id) {
        Warehouse warehouse = find(id);
        if (inventoryRepository.existsByWarehouseId(id) || stockTransactionRepository.existsByWarehouseId(id) || orderRepository.existsByWarehouseId(id)) {
            throw new BadRequestException("Warehouse cannot be deleted while inventory, transactions, or orders reference it");
        }
        warehouseRepository.delete(warehouse);
    }

    private Warehouse find(Long id) { return warehouseRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Warehouse", "id", id)); }
    private void apply(Warehouse w, WarehouseRequest r, String code) {
        w.setWarehouseCode(code); w.setName(required(r.getName())); w.setAddress(required(r.getAddress()));
        w.setCity(required(r.getCity())); w.setState(required(r.getState())); w.setCountry(defaulted(r.getCountry(), "USA"));
        w.setPostalCode(required(r.getPostalCode())); w.setCapacitySqft(r.getCapacitySqft()); w.setManagerName(normalize(r.getManagerName()));
        w.setPhone(normalize(r.getPhone())); w.setEmail(normalize(r.getEmail())); w.setIsActive(Boolean.TRUE.equals(r.getIsActive()));
    }
    private WarehouseResponse toResponse(Warehouse w) { return WarehouseResponse.builder().id(w.getId()).warehouseCode(w.getWarehouseCode()).name(w.getName()).address(w.getAddress()).city(w.getCity()).state(w.getState()).country(w.getCountry()).postalCode(w.getPostalCode()).capacitySqft(w.getCapacitySqft()).managerName(w.getManagerName()).phone(w.getPhone()).email(w.getEmail()).isActive(w.getIsActive()).createdAt(w.getCreatedAt()).updatedAt(w.getUpdatedAt()).build(); }
    private String required(String v) { return v == null ? null : v.trim(); }
    private String normalize(String v) { if (v == null) return null; String n = v.trim(); return n.isEmpty() ? null : n; }
    private String defaulted(String v, String fallback) { String n = normalize(v); return n == null ? fallback : n; }
}
