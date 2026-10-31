package com.retail.inventory.service;

import com.retail.inventory.dto.request.SupplierRequest;
import com.retail.inventory.dto.request.WarehouseRequest;
import com.retail.inventory.entity.Supplier;
import com.retail.inventory.entity.Warehouse;
import com.retail.inventory.exception.BadRequestException;
import com.retail.inventory.exception.DuplicateResourceException;
import com.retail.inventory.repository.InventoryRepository;
import com.retail.inventory.repository.OrderRepository;
import com.retail.inventory.repository.StockTransactionRepository;
import com.retail.inventory.repository.SupplierRepository;
import com.retail.inventory.repository.WarehouseRepository;
import com.retail.inventory.service.impl.SupplierServiceImpl;
import com.retail.inventory.service.impl.WarehouseServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WarehouseSupplierServiceTest {
    @Mock private WarehouseRepository warehouseRepository;
    @Mock private InventoryRepository inventoryRepository;
    @Mock private StockTransactionRepository stockTransactionRepository;
    @Mock private OrderRepository orderRepository;
    @Mock private SupplierRepository supplierRepository;
    @InjectMocks private WarehouseServiceImpl warehouseService;
    @InjectMocks private SupplierServiceImpl supplierService;

    @Test
    void warehouseCreateRejectsDuplicateCode() {
        when(warehouseRepository.existsByWarehouseCode("WH-1")).thenReturn(true);
        WarehouseRequest request = WarehouseRequest.builder().warehouseCode("WH-1").name("Central").address("Road").city("Pune").state("MH").postalCode("411001").isActive(true).build();
        assertThrows(DuplicateResourceException.class, () -> warehouseService.create(request));
        verify(warehouseRepository, never()).save(any());
    }

    @Test
    void warehouseDeleteRejectsInventoryRelationship() {
        Warehouse warehouse = new Warehouse(); warehouse.setId(1L);
        when(warehouseRepository.findById(1L)).thenReturn(Optional.of(warehouse));
        when(inventoryRepository.existsByWarehouseId(1L)).thenReturn(true);
        assertThrows(BadRequestException.class, () -> warehouseService.delete(1L));
        verify(warehouseRepository, never()).delete(any());
    }

    @Test
    void supplierDeleteRejectsOrderRelationship() {
        Supplier supplier = new Supplier(); supplier.setId(2L);
        when(supplierRepository.findById(2L)).thenReturn(Optional.of(supplier));
        when(orderRepository.existsBySupplierId(2L)).thenReturn(true);
        assertThrows(BadRequestException.class, () -> supplierService.delete(2L));
        verify(supplierRepository, never()).delete(any());
    }
}
