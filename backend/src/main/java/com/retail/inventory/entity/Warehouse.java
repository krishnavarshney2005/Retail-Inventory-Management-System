package com.retail.inventory.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "warehouses", indexes = {
    @Index(name = "idx_warehouse_code", columnList = "warehouse_code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Warehouse extends BaseEntity {

    @Column(name = "warehouse_code", nullable = false, unique = true, length = 50)
    private String warehouseCode;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(nullable = false, length = 80)
    private String city;

    @Column(nullable = false, length = 80)
    private String state;

    @Column(length = 80)
    @Builder.Default
    private String country = "USA";

    @Column(name = "postal_code", nullable = false, length = 20)
    private String postalCode;

    @Column(name = "capacity_sqft")
    private Integer capacitySqft;

    @Column(name = "manager_name", length = 100)
    private String managerName;

    @Column(length = 30)
    private String phone;

    @Column(length = 120)
    private String email;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
