package com.retail.inventory.dto.response; import lombok.*; import java.math.BigDecimal;
@Data @Builder @NoArgsConstructor @AllArgsConstructor public class OrderItemResponse {private Long id;private Long productId;private String sku;private String name;private Integer quantityOrdered;private Integer quantityReceived;private BigDecimal unitPrice;private BigDecimal subtotal;}
