package com.yensao.product.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank
    private String name;

    @Size(max = 2000)
    private String description;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal price;

    private String imageUrl;

    @NotNull
    private Long companyId;

    @NotBlank
    private String category;
}
