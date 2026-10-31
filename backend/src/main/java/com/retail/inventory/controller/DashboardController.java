package com.retail.inventory.controller;
import com.retail.inventory.dto.ApiResponse;
import com.retail.inventory.dto.response.DashboardResponse;
import com.retail.inventory.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/v1/dashboard") @RequiredArgsConstructor
public class DashboardController { private final DashboardService service; @GetMapping public ResponseEntity<ApiResponse<DashboardResponse>> get() { return ResponseEntity.ok(ApiResponse.ok(service.getDashboard())); } }
