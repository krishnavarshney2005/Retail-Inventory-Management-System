package com.retail.inventory.dto.response;
import com.retail.inventory.entity.enums.StockAlertType;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class StockAlertResponse { private Long id; private Long productId; private String productSku; private Long warehouseId; private String warehouseCode; private StockAlertType alertType; private Integer currentQuantity; private Integer thresholdQuantity; }
