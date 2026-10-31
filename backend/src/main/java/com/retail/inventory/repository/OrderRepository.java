package com.retail.inventory.repository;

import com.retail.inventory.entity.Order;
import com.retail.inventory.entity.enums.OrderStatus;
import com.retail.inventory.entity.enums.OrderType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    boolean existsByOrderNumber(String orderNumber);

    boolean existsByWarehouseId(Long warehouseId);

    boolean existsBySupplierId(Long supplierId);

    List<Order> findByStatus(OrderStatus status);

    List<Order> findByOrderType(OrderType orderType);

    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.items i " +
           "LEFT JOIN FETCH i.product " +
           "LEFT JOIN FETCH o.warehouse " +
           "LEFT JOIN FETCH o.supplier " +
           "WHERE o.id = :id")
    Optional<Order> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT DISTINCT o FROM Order o " +
           "LEFT JOIN FETCH o.warehouse " +
           "LEFT JOIN FETCH o.supplier " +
           "ORDER BY o.createdAt DESC")
    List<Order> findAllWithDetails();

    @Query(value="SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.warehouse LEFT JOIN FETCH o.supplier WHERE " +
            "(:query IS NULL OR LOWER(o.orderNumber) LIKE LOWER(CONCAT('%',:query,'%'))) AND (:status IS NULL OR o.status=:status) AND " +
            "(:fromDate IS NULL OR o.orderDate>=:fromDate) AND (:toDate IS NULL OR o.orderDate<=:toDate)",
            countQuery="SELECT COUNT(o) FROM Order o WHERE (:query IS NULL OR LOWER(o.orderNumber) LIKE LOWER(CONCAT('%',:query,'%'))) AND (:status IS NULL OR o.status=:status) AND (:fromDate IS NULL OR o.orderDate>=:fromDate) AND (:toDate IS NULL OR o.orderDate<=:toDate)")
    Page<Order> search(@Param("query") String query,@Param("status") OrderStatus status,@Param("fromDate") LocalDate fromDate,@Param("toDate") LocalDate toDate, Pageable pageable);
}
