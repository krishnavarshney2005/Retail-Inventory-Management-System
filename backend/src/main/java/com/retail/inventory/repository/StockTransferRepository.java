package com.retail.inventory.repository;
import com.retail.inventory.entity.StockTransfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
public interface StockTransferRepository extends JpaRepository<StockTransfer, Long> { Page<StockTransfer> findAllByOrderByCreatedAtDesc(Pageable pageable); }
