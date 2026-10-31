package com.retail.inventory.dto.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class StockAdjustmentRequest {
    @NotNull private Long productId;
    @NotNull private Long warehouseId;
    @NotNull private Integer quantityChange;
    @NotBlank private String reason;
    @Builder.Default private String performedBy = "SYSTEM";
}
