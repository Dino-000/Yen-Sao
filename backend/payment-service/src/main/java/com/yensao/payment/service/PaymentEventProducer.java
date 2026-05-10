package com.yensao.payment.service;

import com.yensao.payment.dto.PaymentEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentEventProducer {

    private final KafkaTemplate<String, PaymentEvent> kafkaTemplate;

    public void sendPaymentEvent(PaymentEvent event) {
        log.info("Sending payment event: {}", event);
        kafkaTemplate.send("payment-events", String.valueOf(event.getOrderId()), event);
    }
}
