package com.retail.inventory.service.impl;

import com.retail.inventory.dto.response.DashboardResponse;
import com.retail.inventory.entity.Inventory;
import com.retail.inventory.entity.StockTransaction;
import com.retail.inventory.entity.enums.OrderStatus;
import com.retail.inventory.repository.*;
import com.retail.inventory.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {
    private final ProductRepository products; private final CategoryRepository categories; private final WarehouseRepository warehouses;
    private final SupplierRepository suppliers; private final InventoryRepository inventory; private final OrderRepository orders;
    private final StockTransactionRepository transactions;
    public DashboardResponse getDashboard() {
        List<Inventory> records = inventory.findAllWithProductAndWarehouse();
        long units = records.stream().mapToLong(i -> i.getQuantityOnHand() == null ? 0 : i.getQuantityOnHand()).sum();
        var recentOrders = orders.findAllWithDetails().stream().limit(5).map(o -> new DashboardResponse.RecentOrder(o.getId(), o.getOrderNumber(), o.getStatus().name(), o.getWarehouse().getName(), o.getSupplier() == null ? null : o.getSupplier().getCompanyName(), String.valueOf(o.getTotalAmount()), o.getCreatedAt())).toList();
        var recentTransactions = transactions.findRecentTransactions().stream().limit(8).map(this::transaction).toList();
        var warehouseSummary = records.stream().collect(java.util.stream.Collectors.groupingBy(i -> i.getWarehouse().getId())).values().stream().map(list -> {
            Inventory first = list.get(0); long count = list.stream().mapToLong(i -> i.getQuantityOnHand() == null ? 0 : i.getQuantityOnHand()).sum();
            return new DashboardResponse.WarehouseInventorySummary(first.getWarehouse().getId(), first.getWarehouse().getWarehouseCode(), first.getWarehouse().getName(), count, list.stream().map(i -> i.getProduct().getId()).distinct().count());
        }).toList();
        return new DashboardResponse(products.count(), categories.count(), warehouses.count(), suppliers.count(), units,
                orders.findByStatus(OrderStatus.PENDING).size(), inventory.findLowStockInventory().size(), recentOrders, recentTransactions, warehouseSummary);
    }
    private DashboardResponse.RecentTransaction transaction(StockTransaction t) { return new DashboardResponse.RecentTransaction(t.getId(), t.getTransactionCode(), t.getTransactionType().name(), t.getProduct().getName(), t.getWarehouse().getName(), t.getQuantity(), t.getCreatedAt()); }
}
