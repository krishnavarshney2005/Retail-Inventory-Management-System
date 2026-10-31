package com.retail.inventory.repository;

import com.retail.inventory.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    Optional<Supplier> findBySupplierCode(String supplierCode);

    boolean existsBySupplierCode(String supplierCode);

    boolean existsBySupplierCodeAndIdNot(String supplierCode, Long id);

    List<Supplier> findAllByIsActiveTrue();

    @Query("SELECT s FROM Supplier s WHERE :query IS NULL OR " +
            "LOWER(s.companyName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s.supplierCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s.contactPerson) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(s.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Supplier> search(@Param("query") String query, Pageable pageable);
}
