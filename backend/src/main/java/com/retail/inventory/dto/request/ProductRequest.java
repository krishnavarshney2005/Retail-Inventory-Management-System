package com.retail.inventory.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank(message = "SKU is required")
    @Size(max = 60, message = "SKU cannot exceed 60 characters")
    private String sku;

    private String barcode;

    @NotBlank(message = "Product name is required")
    @Size(max = 200, message = "Product name cannot exceed 200 characters")
    private String name;

    private String description;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "Cost price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Cost price cannot be negative")
    private BigDecimal costPrice;

    @NotNull(message = "Unit retail price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Unit price cannot be negative")
    private BigDecimal unitPrice;

    @NotNull(message = "Minimum stock level is required")
    @Min(value = 0, message = "Min stock level cannot be negative")
    @Builder.Default
    private Integer minStockLevel = 10;

    @NotNull(message = "Maximum stock level is required")
    @Min(value = 1, message = "Max stock level must be at least 1")
    @Builder.Default
    private Integer maxStockLevel = 500;

    @NotNull(message = "Reorder point is required")
    @Min(value = 0, message = "Reorder point cannot be negative")
    @Builder.Default
    private Integer reorderPoint = 25;

    @NotBlank(message = "Unit of measure is required")
    @Builder.Default
    private String unitOfMeasure = "UNIT";

    private String imageUrl;

    @Builder.Default
    private Boolean isActive = true;
}
