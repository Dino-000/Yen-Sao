package com.yensao.payment.repository;

import com.yensao.payment.model.Payment;
import com.yensao.payment.model.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrderId(Long orderId);
    Page<Payment> findByUserId(Long userId, Pageable pageable);
    Page<Payment> findByStatus(PaymentStatus status, Pageable pageable);
}
