package com.retail.inventory.service;

import com.retail.inventory.dto.request.WarehouseRequest;
import com.retail.inventory.dto.response.WarehouseResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WarehouseService {
    Page<WarehouseResponse> findAll(String query, Pageable pageable);
    WarehouseResponse findById(Long id);
    WarehouseResponse create(WarehouseRequest request);
    WarehouseResponse update(Long id, WarehouseRequest request);
    void delete(Long id);
}
