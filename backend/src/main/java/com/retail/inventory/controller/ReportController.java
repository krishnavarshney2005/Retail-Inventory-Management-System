package com.retail.inventory.controller;
import com.retail.inventory.dto.ApiResponse;
import com.retail.inventory.dto.response.ReportResponse;
import com.retail.inventory.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
@RestController @RequestMapping("/v1/reports") @RequiredArgsConstructor
public class ReportController { private final ReportService service; @GetMapping public ResponseEntity<ApiResponse<ReportResponse>> get(@RequestParam(required=false) Long warehouseId, @RequestParam(required=false) Long productId, @RequestParam(required=false) LocalDate fromDate, @RequestParam(required=false) LocalDate toDate) { return ResponseEntity.ok(ApiResponse.ok(service.getReport(warehouseId, productId, fromDate, toDate))); } }
