package com.retail.inventory.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "suppliers", indexes = {
    @Index(name = "idx_supplier_code", columnList = "supplier_code"),
    @Index(name = "idx_supplier_company", columnList = "company_name")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supplier extends BaseEntity {

    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    @Column(name = "supplier_code", nullable = false, unique = true, length = 50)
    private String supplierCode;

    @Column(name = "contact_person", length = 100)
    private String contactPerson;

    @Column(nullable = false, length = 120)
    private String email;

    @Column(length = 30)
    private String phone;

    @Column(length = 255)
    private String address;

    @Column(length = 80)
    private String city;

    @Column(length = 80)
    private String state;

    @Column(length = 80)
    @Builder.Default
    private String country = "USA";

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "tax_id", length = 50)
    private String taxId;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
