package com.retail.inventory.dto.response;
import com.retail.inventory.entity.enums.TransactionType;
import lombok.*;
import java.time.LocalDateTime;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class StockTransactionResponse { private Long id; private String transactionCode; private Long productId; private String productSku; private Long warehouseId; private String warehouseCode; private TransactionType transactionType; private Integer quantity; private Integer previousQuantity; private Integer newQuantity; private String reason; private String referenceNumber; private String performedBy; private LocalDateTime createdAt; }
