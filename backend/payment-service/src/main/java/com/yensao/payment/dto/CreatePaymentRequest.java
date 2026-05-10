package com.yensao.payment.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreatePaymentRequest {
    @NotNull
    private Long orderId;

    @NotNull
    private Long userId;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal amount;

    @NotBlank
    private String paymentMethod;
}
