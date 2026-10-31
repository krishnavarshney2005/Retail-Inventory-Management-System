package com.retail.inventory.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
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
public class WarehouseRequest {

    @NotBlank(message = "Warehouse code is required")
    @Size(max = 50, message = "Warehouse code cannot exceed 50 characters")
    private String warehouseCode;

    @NotBlank(message = "Warehouse name is required")
    @Size(max = 150, message = "Warehouse name cannot exceed 150 characters")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @Builder.Default
    private String country = "USA";

    @NotBlank(message = "Postal code is required")
    private String postalCode;

    @Min(value = 1, message = "Capacity must be at least 1 square foot")
    private Integer capacitySqft;
    private String managerName;
    @Pattern(regexp = "^[0-9+() .-]{7,30}$", message = "Phone number contains invalid characters")
    private String phone;

    @Email(message = "Email must be valid")
    private String email;

    @Builder.Default
    private Boolean isActive = true;
}
