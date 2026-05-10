package com.yensao.cart.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class AddToCartRequest {
    @NotNull
    private Long productId;

    @NotBlank
    private String productName;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal price;

    @NotNull
    @Min(1)
    private Integer quantity;
}
