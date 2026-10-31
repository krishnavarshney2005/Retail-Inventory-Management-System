package com.retail.inventory.dto.response;

import java.time.LocalDateTime;
import java.util.List;

/** Database-derived summary for the operational dashboard. */
public record DashboardResponse(long totalProducts, long totalCategories, long totalWarehouses,
                                long totalSuppliers, long totalInventoryUnits, long pendingOrders,
                                long lowStockProducts, List<RecentOrder> recentOrders,
                                List<RecentTransaction> recentTransactions,
                                List<WarehouseInventorySummary> warehouseInventory) {
    public record RecentOrder(Long id, String orderNumber, String status, String warehouseName,
                              String supplierName, String totalAmount, LocalDateTime createdAt) { }
    public record RecentTransaction(Long id, String transactionCode, String type, String productName,
                                    String warehouseName, Integer quantity, LocalDateTime createdAt) { }
    public record WarehouseInventorySummary(Long warehouseId, String warehouseCode, String warehouseName,
                                            long inventoryUnits, long distinctProducts) { }
}
