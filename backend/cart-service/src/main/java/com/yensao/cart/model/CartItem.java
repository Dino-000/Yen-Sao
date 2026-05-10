package com.yensao.cart.model;

import lombok.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem implements Serializable {
    private Long productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
}
