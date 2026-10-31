package com.retail.inventory.service;

import com.retail.inventory.dto.request.SupplierRequest;
import com.retail.inventory.dto.response.SupplierResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SupplierService {
    Page<SupplierResponse> findAll(String query, Pageable pageable);
    SupplierResponse findById(Long id);
    SupplierResponse create(SupplierRequest request);
    SupplierResponse update(Long id, SupplierRequest request);
    void delete(Long id);
}
