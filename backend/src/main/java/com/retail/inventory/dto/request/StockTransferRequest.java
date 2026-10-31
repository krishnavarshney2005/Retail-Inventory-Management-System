package com.retail.inventory.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockTransferRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Source warehouse ID is required")
    private Long fromWarehouseId;

    @NotNull(message = "Destination warehouse ID is required")
    private Long toWarehouseId;

    @NotNull(message = "Transfer quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private String notes;

    @Builder.Default
    private String performedBy = "SYSTEM";
}
