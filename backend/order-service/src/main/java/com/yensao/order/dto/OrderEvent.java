package com.yensao.order.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderEvent {
    private Long orderId;
    private Long userId;
    private BigDecimal totalAmount;
    private String eventType;
}
