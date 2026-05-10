package com.yensao.payment.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderEventConsumer {

    private final PaymentService paymentService;

    @KafkaListener(topics = "order-events", groupId = "payment-service")
    public void handleOrderEvent(Map<String, Object> event) {
        log.info("Received order event: {}", event);
        String eventType = (String) event.get("eventType");

        if ("ORDER_CREATED".equals(eventType)) {
            log.info("Order created, awaiting payment initiation");
        } else if ("ORDER_CANCELLED".equals(eventType)) {
            Long orderId = ((Number) event.get("orderId")).longValue();
            paymentService.refundByOrderId(orderId);
        }
    }
}
