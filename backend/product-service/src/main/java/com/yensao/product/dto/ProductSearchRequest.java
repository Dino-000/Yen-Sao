package com.yensao.product.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductSearchRequest {
    private String name;
    private String category;
    private Long companyId;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private int page = 0;
    private int size = 20;
    private String sortBy = "createdAt";
    private String sortDir = "desc";
}
