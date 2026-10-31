package com.retail.inventory.repository;

import com.retail.inventory.entity.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

import java.util.List;

@Repository
public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {

    List<StockTransaction> findByProductId(Long productId);

    List<StockTransaction> findByWarehouseId(Long warehouseId);

    List<StockTransaction> findByReferenceNumber(String referenceNumber);

    boolean existsByProductId(Long productId);

    boolean existsByWarehouseId(Long warehouseId);

    @Query("SELECT t FROM StockTransaction t " +
           "JOIN FETCH t.product " +
           "JOIN FETCH t.warehouse " +
           "ORDER BY t.createdAt DESC")
    List<StockTransaction> findRecentTransactions();

    @Query(value = "SELECT t FROM StockTransaction t JOIN FETCH t.product JOIN FETCH t.warehouse ORDER BY t.createdAt DESC", countQuery = "SELECT COUNT(t) FROM StockTransaction t")
    Page<StockTransaction> findAllWithDetails(Pageable pageable);

    @Query("SELECT t FROM StockTransaction t JOIN FETCH t.product JOIN FETCH t.warehouse WHERE t.id = :id")
    Optional<StockTransaction> findByIdWithDetails(@org.springframework.data.repository.query.Param("id") Long id);
}
