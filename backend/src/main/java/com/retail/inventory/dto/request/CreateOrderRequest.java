package com.retail.inventory.dto.request;

import com.retail.inventory.entity.enums.OrderType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    @NotNull(message = "Order type is required")
    private OrderType orderType;

    @NotNull(message = "Fulfillment warehouse ID is required")
    private Long warehouseId;

    private Long supplierId;

    private String customerName;

    private String customerEmail;

    @Builder.Default
    private LocalDate orderDate = LocalDate.now();

    private LocalDate expectedDeliveryDate;

    private String notes;

    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal shippingAmount = BigDecimal.ZERO;

    @NotEmpty(message = "Order must contain at least one line item")
    @Valid
    @Builder.Default
    private List<OrderItemRequest> items = new ArrayList<>();
}
