package com.yensao.payment.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEvent {
    private Long paymentId;
    private Long orderId;
    private Long userId;
    private BigDecimal amount;
    private String eventType;
}
