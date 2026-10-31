package com.retail.inventory.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stock_transfers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StockTransfer extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "product_id", nullable = false) private Product product;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "from_warehouse_id", nullable = false) private Warehouse fromWarehouse;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "to_warehouse_id", nullable = false) private Warehouse toWarehouse;
    @Column(nullable = false) private Integer quantity;
    @Column(columnDefinition = "TEXT") private String notes;
    @Column(name = "performed_by", length = 100) private String performedBy;
    @Column(name = "reference_number", nullable = false, unique = true, length = 100) private String referenceNumber;
}
