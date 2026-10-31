package com.retail.inventory.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String sku;
    private String barcode;
    private String name;
    private String description;
    private Long categoryId;
    private String categoryName;
    private String categoryCode;
    private BigDecimal costPrice;
    private BigDecimal unitPrice;
    private Integer minStockLevel;
    private Integer maxStockLevel;
    private Integer reorderPoint;
    private String unitOfMeasure;
    private String imageUrl;
    private Integer totalStock;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
