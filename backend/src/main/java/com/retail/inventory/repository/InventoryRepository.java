package com.retail.inventory.repository;

import com.retail.inventory.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByProductIdAndWarehouseId(Long productId, Long warehouseId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM Inventory i JOIN FETCH i.product JOIN FETCH i.warehouse WHERE i.product.id = :productId AND i.warehouse.id = :warehouseId")
    Optional<Inventory> findByProductIdAndWarehouseIdForUpdate(@Param("productId") Long productId, @Param("warehouseId") Long warehouseId);

    List<Inventory> findByProductId(Long productId);

    List<Inventory> findByWarehouseId(Long warehouseId);

    boolean existsByProductId(Long productId);

    boolean existsByWarehouseId(Long warehouseId);

    @Query("SELECT i FROM Inventory i " +
           "JOIN FETCH i.product p " +
           "JOIN FETCH i.warehouse w " +
           "WHERE (i.quantityOnHand - i.quantityReserved) <= p.reorderPoint")
    List<Inventory> findLowStockInventory();

    @Query("SELECT COALESCE(SUM(i.quantityOnHand - i.quantityReserved), 0) FROM Inventory i WHERE i.product.id = :productId")
    Integer getTotalAvailableQuantityByProductId(@Param("productId") Long productId);

    @Query("SELECT i FROM Inventory i JOIN FETCH i.product JOIN FETCH i.warehouse")
    List<Inventory> findAllWithProductAndWarehouse();

    @Query(value = "SELECT i FROM Inventory i JOIN FETCH i.product p JOIN FETCH i.warehouse w WHERE " +
            "(:query IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(w.name) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
            "(:productId IS NULL OR p.id = :productId) AND (:warehouseId IS NULL OR w.id = :warehouseId)",
            countQuery = "SELECT COUNT(i) FROM Inventory i WHERE (:productId IS NULL OR i.product.id = :productId) AND (:warehouseId IS NULL OR i.warehouse.id = :warehouseId)")
    Page<Inventory> search(@Param("query") String query, @Param("productId") Long productId, @Param("warehouseId") Long warehouseId, Pageable pageable);
}
