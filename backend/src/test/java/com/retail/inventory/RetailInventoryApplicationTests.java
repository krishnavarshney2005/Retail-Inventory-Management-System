package com.retail.inventory;

import com.retail.inventory.entity.Category;
import com.retail.inventory.entity.Product;
import com.retail.inventory.entity.Supplier;
import com.retail.inventory.entity.Warehouse;
import com.retail.inventory.entity.enums.OrderStatus;
import com.retail.inventory.entity.enums.OrderType;
import com.retail.inventory.dto.request.StockAdjustmentRequest;
import com.retail.inventory.dto.request.StockTransferRequest;
import com.retail.inventory.repository.CategoryRepository;
import com.retail.inventory.repository.InventoryRepository;
import com.retail.inventory.repository.OrderRepository;
import com.retail.inventory.repository.ProductRepository;
import com.retail.inventory.repository.SupplierRepository;
import com.retail.inventory.repository.WarehouseRepository;
import com.retail.inventory.repository.StockTransactionRepository;
import com.retail.inventory.repository.StockTransferRepository;
import com.retail.inventory.service.InventoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class RetailInventoryApplicationTests {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired private InventoryRepository inventoryRepository;
    @Autowired private StockTransactionRepository stockTransactionRepository;
    @Autowired private StockTransferRepository stockTransferRepository;
    @Autowired private InventoryService inventoryService;

    @Test
    void contextLoads() throws SQLException {
        assertNotNull(dataSource, "DataSource should be configured");
        try (Connection connection = dataSource.getConnection()) {
            assertNotNull(connection, "Connection to MySQL database should be established");
            assertTrue(connection.isValid(2), "Database connection should be valid");
        }
    }

    @Test
    @Transactional
    void persistsProductAndCategoryUsingMySql() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        Category category = new Category();
        category.setName("Persistence Category " + suffix);
        category.setCode("PERSIST-" + suffix);
        category.setIsActive(true);
        category = categoryRepository.saveAndFlush(category);

        Product product = new Product();
        product.setSku("PERSIST-" + suffix);
        product.setName("Persistence Product " + suffix);
        product.setCategory(category);
        product.setCostPrice(BigDecimal.TEN);
        product.setUnitPrice(new BigDecimal("15.00"));
        product.setMinStockLevel(1);
        product.setMaxStockLevel(10);
        product.setReorderPoint(5);
        product.setUnitOfMeasure("UNIT");
        product.setIsActive(true);
        product = productRepository.saveAndFlush(product);

        assertNotNull(product.getId());
        assertTrue(productRepository.findBySku(product.getSku()).isPresent());
    }

    @Test
    @Transactional
    void persistsWarehouseSupplierAndOrderRelationshipUsingMySql() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        Warehouse warehouse = new Warehouse();
        warehouse.setWarehouseCode("WH-PERSIST-" + suffix);
        warehouse.setName("Persistence Warehouse");
        warehouse.setAddress("1 Test Road");
        warehouse.setCity("Pune");
        warehouse.setState("MH");
        warehouse.setPostalCode("411001");
        warehouse.setIsActive(true);
        warehouse = warehouseRepository.saveAndFlush(warehouse);

        Supplier supplier = new Supplier();
        supplier.setCompanyName("Persistence Supplier");
        supplier.setSupplierCode("SUP-PERSIST-" + suffix);
        supplier.setEmail("supplier-" + suffix + "@example.test");
        supplier.setIsActive(true);
        supplier = supplierRepository.saveAndFlush(supplier);

        com.retail.inventory.entity.Order order = new com.retail.inventory.entity.Order();
        order.setOrderNumber("PO-PERSIST-" + suffix);
        order.setOrderType(OrderType.PURCHASE_ORDER);
        order.setSupplier(supplier);
        order.setWarehouse(warehouse);
        order.setStatus(OrderStatus.DRAFT);
        order.setOrderDate(LocalDate.now());
        order.setTotalAmount(BigDecimal.ZERO);
        order = orderRepository.saveAndFlush(order);

        assertTrue(orderRepository.findByIdWithDetails(order.getId()).isPresent());
        assertEquals(warehouse.getId(), order.getWarehouse().getId());
        assertEquals(supplier.getId(), order.getSupplier().getId());
    }

    @Test
    @Transactional
    void adjustsTransfersAndAuditsInventoryUsingMySql() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        Category category = new Category(); category.setName("Inventory Category " + suffix); category.setCode("INV-CAT-" + suffix); category.setIsActive(true); category = categoryRepository.saveAndFlush(category);
        Product product = new Product(); product.setSku("INV-SKU-" + suffix); product.setName("Inventory Product"); product.setCategory(category); product.setCostPrice(BigDecimal.ONE); product.setUnitPrice(BigDecimal.TEN); product.setMinStockLevel(1); product.setMaxStockLevel(100); product.setReorderPoint(8); product.setUnitOfMeasure("UNIT"); product.setIsActive(true); product = productRepository.saveAndFlush(product);
        Warehouse source = warehouse("INV-WH-A-" + suffix, "Source"); source = warehouseRepository.saveAndFlush(source);
        Warehouse target = warehouse("INV-WH-B-" + suffix, "Target"); target = warehouseRepository.saveAndFlush(target);
        com.retail.inventory.entity.Inventory sourceInventory = new com.retail.inventory.entity.Inventory(); sourceInventory.setProduct(product); sourceInventory.setWarehouse(source); sourceInventory.setQuantityOnHand(10); sourceInventory.setQuantityReserved(2); sourceInventory = inventoryRepository.saveAndFlush(sourceInventory);

        inventoryService.adjust(StockAdjustmentRequest.builder().productId(product.getId()).warehouseId(source.getId()).quantityChange(5).reason("cycle count").build());
        var transfer = inventoryService.transfer(StockTransferRequest.builder().productId(product.getId()).fromWarehouseId(source.getId()).toWarehouseId(target.getId()).quantity(5).notes("replenish").build());

        assertEquals(10, inventoryRepository.findById(sourceInventory.getId()).orElseThrow().getQuantityOnHand());
        assertEquals(5, inventoryRepository.findByProductIdAndWarehouseId(product.getId(), target.getId()).orElseThrow().getQuantityOnHand());
        assertEquals(3, stockTransactionRepository.findByProductId(product.getId()).size());
        assertTrue(stockTransferRepository.existsById(transfer.getId()));
        Long productId = product.getId();
        Long sourceWarehouseId = source.getId();
        assertTrue(inventoryService.lowStock().stream().anyMatch(item -> item.getProductId().equals(productId) && item.getWarehouseId().equals(sourceWarehouseId)));
    }

    private Warehouse warehouse(String code, String name) {
        Warehouse warehouse = new Warehouse(); warehouse.setWarehouseCode(code); warehouse.setName(name); warehouse.setAddress("Test road"); warehouse.setCity("Pune"); warehouse.setState("MH"); warehouse.setPostalCode("411001"); warehouse.setIsActive(true); return warehouse;
    }
}
