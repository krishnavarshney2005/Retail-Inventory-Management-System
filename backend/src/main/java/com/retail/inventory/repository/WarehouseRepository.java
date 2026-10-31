package com.retail.inventory.repository;

import com.retail.inventory.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

    Optional<Warehouse> findByWarehouseCode(String warehouseCode);

    boolean existsByWarehouseCode(String warehouseCode);

    boolean existsByWarehouseCodeAndIdNot(String warehouseCode, Long id);

    List<Warehouse> findAllByIsActiveTrue();

    @Query("SELECT w FROM Warehouse w WHERE :query IS NULL OR " +
            "LOWER(w.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(w.warehouseCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(w.city) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Warehouse> search(@Param("query") String query, Pageable pageable);
}
