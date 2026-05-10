package com.yensao.order.repository;

import com.yensao.order.model.Order;
import com.yensao.order.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserId(Long userId, Pageable pageable);
    Page<Order> findByCompanyId(Long companyId, Pageable pageable);
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);
}
