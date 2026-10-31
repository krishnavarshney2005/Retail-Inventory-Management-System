package com.retail.inventory.controller;

import com.retail.inventory.dto.ApiResponse;
import com.retail.inventory.dto.SystemStatusDto;
import com.retail.inventory.service.SystemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/system")
@RequiredArgsConstructor
@Tag(name = "System Diagnostics", description = "Endpoints for backend health checks and system configuration")
public class SystemController {

    private final SystemService systemService;

    @GetMapping("/status")
    @Operation(summary = "Get system status", description = "Returns system information, database connectivity, and enabled retail modules")
    public ResponseEntity<ApiResponse<SystemStatusDto>> getStatus() {
        SystemStatusDto status = systemService.getSystemStatus();
        return ResponseEntity.ok(ApiResponse.ok(status, "System status retrieved successfully"));
    }

    @GetMapping("/ping")
    @Operation(summary = "Ping backend", description = "Simple heartbeat endpoint to verify REST connectivity")
    public ResponseEntity<ApiResponse<String>> ping() {
        return ResponseEntity.ok(ApiResponse.ok("pong", "Retail Inventory API is responsive"));
    }
}
