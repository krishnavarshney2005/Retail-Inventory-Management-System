package com.retail.inventory.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupplierRequest {

    @NotBlank(message = "Company name is required")
    @Size(max = 150, message = "Company name cannot exceed 150 characters")
    private String companyName;

    @NotBlank(message = "Supplier code is required")
    @Size(max = 50, message = "Supplier code cannot exceed 50 characters")
    private String supplierCode;

    private String contactPerson;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @Pattern(regexp = "^[0-9+() .-]{7,30}$", message = "Phone number contains invalid characters")
    private String phone;
    private String address;
    private String city;
    private String state;

    @Builder.Default
    private String country = "USA";

    private String postalCode;
    private String taxId;

    @Builder.Default
    private Boolean isActive = true;
}
