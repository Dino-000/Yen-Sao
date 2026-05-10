package com.yensao.cart.dto;

import com.yensao.cart.model.CartItem;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    private Long userId;
    private List<CartItem> items;
    private int totalItems;
    private BigDecimal totalPrice;
}
