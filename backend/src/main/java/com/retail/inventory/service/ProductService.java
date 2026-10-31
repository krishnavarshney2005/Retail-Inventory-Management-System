package com.retail.inventory.service;

import com.retail.inventory.dto.request.ProductRequest;
import com.retail.inventory.dto.response.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {

    Page<ProductResponse> findAll(String query, Long categoryId, Pageable pageable);

    ProductResponse findById(Long id);

    ProductResponse create(ProductRequest request);

    ProductResponse update(Long id, ProductRequest request);

    void delete(Long id);
}
