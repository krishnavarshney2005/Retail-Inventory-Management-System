package com.retail.inventory.repository;

import com.retail.inventory.entity.StockAlert;
import com.retail.inventory.entity.enums.StockAlertStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockAlertRepository extends JpaRepository<StockAlert, Long> {

    List<StockAlert> findByStatus(StockAlertStatus status);

    List<StockAlert> findByProductId(Long productId);

    List<StockAlert> findByWarehouseId(Long warehouseId);

    boolean existsByProductId(Long productId);

    Optional<StockAlert> findByProductIdAndWarehouseIdAndStatus(Long productId, Long warehouseId, StockAlertStatus status);
}
