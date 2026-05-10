package com.yensao.order.service;

import com.yensao.order.model.Order;
import com.yensao.order.model.OrderStatus;
import com.yensao.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentEventConsumer {

    private final OrderRepository orderRepository;

    @KafkaListener(topics = "payment-events", groupId = "order-service")
    @Transactional
    public void handlePaymentEvent(Map<String, Object> event) {
        log.info("Received payment event: {}", event);
        Long orderId = ((Number) event.get("orderId")).longValue();
        String eventType = (String) event.get("eventType");

        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            log.warn("Order not found: {}", orderId);
            return;
        }

        if ("PAYMENT_COMPLETED".equals(eventType)) {
            order.setStatus(OrderStatus.CONFIRMED);
        } else if ("PAYMENT_FAILED".equals(eventType)) {
            order.setStatus(OrderStatus.CANCELLED);
        }
        orderRepository.save(order);
    }
}
