package com.retail.inventory.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/** Read-only reporting payloads. Monetary totals are based on persisted product cost prices. */
public record ReportResponse(List<InventoryRow> inventory, List<OrderRow> orders,
                             List<TransactionRow> movements, BigDecimal inventoryValuation) {
    public record InventoryRow(Long productId, String sku, String productName, Long warehouseId,
                               String warehouseName, Integer onHand, Integer reserved, Integer available,
                               Integer reorderPoint, boolean lowStock, BigDecimal unitCost, BigDecimal value) { }
    public record OrderRow(Long id, String orderNumber, String status, String orderType,
                           String warehouseName, String supplierName, BigDecimal totalAmount,
                           java.time.LocalDate orderDate) { }
    public record TransactionRow(Long id, String transactionCode, String type, String productName,
                                 String warehouseName, Integer quantity, Integer previousQuantity,
                                 Integer newQuantity, String reason, LocalDateTime createdAt) { }
}
