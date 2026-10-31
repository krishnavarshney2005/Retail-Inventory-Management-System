package com.retail.inventory.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryResponse {

    private Long id;
    private Long productId;
    private String productSku;
    private String productName;
    private Long warehouseId;
    private String warehouseCode;
    private String warehouseName;
    private Integer quantityOnHand;
    private Integer quantityReserved;
    private Integer quantityAvailable;
    private String binLocation;
    private Integer reorderPoint;
    private Boolean isLowStock;
    private LocalDateTime lastCountedAt;
    private LocalDateTime updatedAt;
}
