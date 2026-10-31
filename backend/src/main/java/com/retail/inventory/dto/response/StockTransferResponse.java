package com.retail.inventory.dto.response;
import lombok.*;
import java.time.LocalDateTime;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class StockTransferResponse { private Long id; private String referenceNumber; private Long productId; private String productSku; private Long fromWarehouseId; private String fromWarehouseCode; private Long toWarehouseId; private String toWarehouseCode; private Integer quantity; private String notes; private String performedBy; private LocalDateTime createdAt; }
