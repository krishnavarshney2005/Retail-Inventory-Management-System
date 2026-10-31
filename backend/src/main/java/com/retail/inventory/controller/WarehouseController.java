package com.retail.inventory.controller;

import com.retail.inventory.dto.ApiResponse;
import com.retail.inventory.dto.request.WarehouseRequest;
import com.retail.inventory.dto.response.WarehouseResponse;
import com.retail.inventory.service.WarehouseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/warehouses")
@RequiredArgsConstructor
public class WarehouseController {
    private final WarehouseService warehouseService;
    @GetMapping public ResponseEntity<ApiResponse<Page<WarehouseResponse>>> findAll(@RequestParam(required = false) String query, @PageableDefault(size = 20, sort = "name") Pageable pageable) { return ResponseEntity.ok(ApiResponse.ok(warehouseService.findAll(query, pageable))); }
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<WarehouseResponse>> findById(@PathVariable Long id) { return ResponseEntity.ok(ApiResponse.ok(warehouseService.findById(id))); }
    @PostMapping public ResponseEntity<ApiResponse<WarehouseResponse>> create(@Valid @RequestBody WarehouseRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(warehouseService.create(request), "Warehouse created successfully")); }
    @PutMapping("/{id}") public ResponseEntity<ApiResponse<WarehouseResponse>> update(@PathVariable Long id, @Valid @RequestBody WarehouseRequest request) { return ResponseEntity.ok(ApiResponse.ok(warehouseService.update(id, request), "Warehouse updated successfully")); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) { warehouseService.delete(id); return ResponseEntity.noContent().build(); }
}
