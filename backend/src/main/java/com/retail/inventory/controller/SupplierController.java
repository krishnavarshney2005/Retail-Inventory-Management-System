package com.retail.inventory.controller;

import com.retail.inventory.dto.ApiResponse;
import com.retail.inventory.dto.request.SupplierRequest;
import com.retail.inventory.dto.response.SupplierResponse;
import com.retail.inventory.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/suppliers")
@RequiredArgsConstructor
public class SupplierController {
    private final SupplierService supplierService;
    @GetMapping public ResponseEntity<ApiResponse<Page<SupplierResponse>>> findAll(@RequestParam(required = false) String query, @PageableDefault(size = 20, sort = "companyName") Pageable pageable) { return ResponseEntity.ok(ApiResponse.ok(supplierService.findAll(query, pageable))); }
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<SupplierResponse>> findById(@PathVariable Long id) { return ResponseEntity.ok(ApiResponse.ok(supplierService.findById(id))); }
    @PostMapping public ResponseEntity<ApiResponse<SupplierResponse>> create(@Valid @RequestBody SupplierRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(supplierService.create(request), "Supplier created successfully")); }
    @PutMapping("/{id}") public ResponseEntity<ApiResponse<SupplierResponse>> update(@PathVariable Long id, @Valid @RequestBody SupplierRequest request) { return ResponseEntity.ok(ApiResponse.ok(supplierService.update(id, request), "Supplier updated successfully")); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) { supplierService.delete(id); return ResponseEntity.noContent().build(); }
}
