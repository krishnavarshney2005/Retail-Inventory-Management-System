package com.retail.inventory.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventories",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_product_warehouse", columnNames = {"product_id", "warehouse_id"})
    },
    indexes = {
        @Index(name = "idx_inventory_product", columnList = "product_id"),
        @Index(name = "idx_inventory_warehouse", columnList = "warehouse_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(name = "quantity_on_hand", nullable = false)
    @Builder.Default
    private Integer quantityOnHand = 0;

    @Column(name = "quantity_reserved", nullable = false)
    @Builder.Default
    private Integer quantityReserved = 0;

    @Column(name = "bin_location", length = 50)
    private String binLocation;

    @Column(name = "last_counted_at")
    private LocalDateTime lastCountedAt;

    @Transient
    public Integer getQuantityAvailable() {
        int onHand = this.quantityOnHand != null ? this.quantityOnHand : 0;
        int reserved = this.quantityReserved != null ? this.quantityReserved : 0;
        return Math.max(0, onHand - reserved);
    }
}
