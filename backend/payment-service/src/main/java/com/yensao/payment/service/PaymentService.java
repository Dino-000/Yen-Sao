package com.yensao.payment.service;

import com.yensao.payment.dto.*;
import com.yensao.payment.model.*;
import com.yensao.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentEventProducer paymentEventProducer;

    @Transactional
    public PaymentResponse createPayment(CreatePaymentRequest request) {
        paymentRepository.findByOrderId(request.getOrderId()).ifPresent(p -> {
            throw new RuntimeException("Payment already exists for order: " + request.getOrderId());
        });

        Payment payment = Payment.builder()
                .orderId(request.getOrderId())
                .userId(request.getUserId())
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .status(PaymentStatus.PENDING)
                .build();

        payment = paymentRepository.save(payment);
        return mapToResponse(payment);
    }

    @Transactional
    public PaymentResponse processPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + paymentId));

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new RuntimeException("Payment is not in PENDING state");
        }

        payment.setStatus(PaymentStatus.PROCESSING);
        paymentRepository.save(payment);

        // Simulate payment processing
        boolean success = simulatePayment();

        if (success) {
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setTransactionId(UUID.randomUUID().toString());
            paymentEventProducer.sendPaymentEvent(PaymentEvent.builder()
                    .paymentId(payment.getId())
                    .orderId(payment.getOrderId())
                    .userId(payment.getUserId())
                    .amount(payment.getAmount())
                    .eventType("PAYMENT_COMPLETED")
                    .build());
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            paymentEventProducer.sendPaymentEvent(PaymentEvent.builder()
                    .paymentId(payment.getId())
                    .orderId(payment.getOrderId())
                    .userId(payment.getUserId())
                    .amount(payment.getAmount())
                    .eventType("PAYMENT_FAILED")
                    .build());
        }

        payment = paymentRepository.save(payment);
        return mapToResponse(payment);
    }

    public PaymentResponse getById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + id));
        return mapToResponse(payment);
    }

    public PaymentResponse getByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for order: " + orderId));
        return mapToResponse(payment);
    }

    public Page<PaymentResponse> getByUser(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return paymentRepository.findByUserId(userId, pageable).map(this::mapToResponse);
    }

    @Transactional
    public PaymentResponse refund(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + paymentId));

        if (payment.getStatus() != PaymentStatus.COMPLETED) {
            throw new RuntimeException("Can only refund completed payments");
        }

        payment.setStatus(PaymentStatus.REFUNDED);
        payment = paymentRepository.save(payment);

        paymentEventProducer.sendPaymentEvent(PaymentEvent.builder()
                .paymentId(payment.getId())
                .orderId(payment.getOrderId())
                .userId(payment.getUserId())
                .amount(payment.getAmount())
                .eventType("PAYMENT_REFUNDED")
                .build());

        return mapToResponse(payment);
    }

    @Transactional
    public void refundByOrderId(Long orderId) {
        paymentRepository.findByOrderId(orderId).ifPresent(payment -> {
            if (payment.getStatus() == PaymentStatus.COMPLETED) {
                payment.setStatus(PaymentStatus.REFUNDED);
                paymentRepository.save(payment);
                log.info("Refunded payment for cancelled order: {}", orderId);
            }
        });
    }

    private boolean simulatePayment() {
        return Math.random() > 0.1;
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .userId(payment.getUserId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .paymentMethod(payment.getPaymentMethod())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
