package com.yensao.cart.model;

import lombok.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart implements Serializable {
    private Long userId;
    @Builder.Default
    private List<CartItem> items = new ArrayList<>();
}
