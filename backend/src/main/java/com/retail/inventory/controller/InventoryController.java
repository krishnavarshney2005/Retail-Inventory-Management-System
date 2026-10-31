package com.retail.inventory.controller;
import com.retail.inventory.dto.ApiResponse; import com.retail.inventory.dto.request.*; import com.retail.inventory.dto.response.*; import com.retail.inventory.service.InventoryService; import jakarta.validation.Valid; import lombok.RequiredArgsConstructor; import org.springframework.data.domain.*; import org.springframework.data.web.PageableDefault; import org.springframework.http.*; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/v1/inventory") @RequiredArgsConstructor
public class InventoryController { private final InventoryService service;
 @GetMapping public ResponseEntity<ApiResponse<Page<InventoryResponse>>> all(@RequestParam(required=false)String query,@RequestParam(required=false)Long productId,@RequestParam(required=false)Long warehouseId,@PageableDefault(size=20,sort="updatedAt",direction=Sort.Direction.DESC) Pageable p){return ResponseEntity.ok(ApiResponse.ok(service.findAll(query,productId,warehouseId,p)));}
 @GetMapping("/{id}") public ResponseEntity<ApiResponse<InventoryResponse>> byId(@PathVariable Long id){return ResponseEntity.ok(ApiResponse.ok(service.findById(id)));}
 @GetMapping("/warehouse/{id}") public ResponseEntity<ApiResponse<Page<InventoryResponse>>> byWarehouse(@PathVariable Long id,@PageableDefault(size=20) Pageable p){return ResponseEntity.ok(ApiResponse.ok(service.findAll(null,null,id,p)));}
 @GetMapping("/product/{id}") public ResponseEntity<ApiResponse<Page<InventoryResponse>>> byProduct(@PathVariable Long id,@PageableDefault(size=20) Pageable p){return ResponseEntity.ok(ApiResponse.ok(service.findAll(null,id,null,p)));}
 @GetMapping("/low-stock") public ResponseEntity<ApiResponse<List<InventoryResponse>>> low(){return ResponseEntity.ok(ApiResponse.ok(service.lowStock()));}
 @GetMapping("/alerts") public ResponseEntity<ApiResponse<List<StockAlertResponse>>> alerts(){return ResponseEntity.ok(ApiResponse.ok(service.activeAlerts()));}
 @PostMapping("/adjustments") public ResponseEntity<ApiResponse<StockTransactionResponse>> adjust(@Valid @RequestBody StockAdjustmentRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(service.adjust(r),"Stock adjusted"));}
 @PostMapping("/transfers") public ResponseEntity<ApiResponse<StockTransferResponse>> transfer(@Valid @RequestBody StockTransferRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(service.transfer(r),"Stock transferred"));}
 @GetMapping("/transfers") public ResponseEntity<ApiResponse<Page<StockTransferResponse>>> transfers(@PageableDefault(size=20) Pageable p){return ResponseEntity.ok(ApiResponse.ok(service.transfers(p)));}
 @GetMapping("/transfers/{id}") public ResponseEntity<ApiResponse<StockTransferResponse>> transferById(@PathVariable Long id){return ResponseEntity.ok(ApiResponse.ok(service.transferById(id)));}
 @GetMapping("/transactions") public ResponseEntity<ApiResponse<Page<StockTransactionResponse>>> transactions(@PageableDefault(size=20) Pageable p){return ResponseEntity.ok(ApiResponse.ok(service.transactions(p)));}
 @GetMapping("/transactions/{id}") public ResponseEntity<ApiResponse<StockTransactionResponse>> transaction(@PathVariable Long id){return ResponseEntity.ok(ApiResponse.ok(service.transactionById(id)));}
}
