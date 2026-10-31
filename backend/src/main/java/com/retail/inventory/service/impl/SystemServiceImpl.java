package com.retail.inventory.service.impl;

import com.retail.inventory.dto.SystemStatusDto;
import com.retail.inventory.service.SystemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SystemServiceImpl implements SystemService {

    private final DataSource dataSource;

    @Override
    public SystemStatusDto getSystemStatus() {
        boolean dbConnected = false;
        try (Connection conn = dataSource.getConnection()) {
            dbConnected = conn.isValid(2);
        } catch (Exception e) {
            log.warn("Database connection check failed: {}", e.getMessage());
        }

        List<String> modules = List.of(
                "Dashboard",
                "Product Management",
                "Category Management",
                "Warehouse Management",
                "Inventory Management",
                "Supplier Management",
                "Order Management",
                "Reports and Low Stock Alerts"
        );

        Map<String, Object> stats = Map.of(
                "jvmMemoryFreeMB", Runtime.getRuntime().freeMemory() / (1024 * 1024),
                "jvmMemoryTotalMB", Runtime.getRuntime().totalMemory() / (1024 * 1024),
                "availableProcessors", Runtime.getRuntime().availableProcessors()
        );

        return SystemStatusDto.builder()
                .systemName("Retail Inventory Management System")
                .version("1.0.0-SNAPSHOT")
                .status("ONLINE")
                .environment("Development")
                .javaVersion(System.getProperty("java.version"))
                .serverTime(LocalDateTime.now())
                .databaseConnected(dbConnected)
                .availableModules(modules)
                .statistics(stats)
                .build();
    }
}
