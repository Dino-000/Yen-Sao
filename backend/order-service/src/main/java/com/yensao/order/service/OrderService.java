package com.yensao.order.service;

import com.yensao.order.dto.*;
import com.yensao.order.model.*;
import com.yensao.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderEventProducer orderEventProducer;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        Order order = Order.builder()
                .userId(request.getUserId())
                .companyId(request.getCompanyId())
                .status(OrderStatus.PENDING)
                .build();

        BigDecimal total = BigDecimal.ZERO;
        for (OrderItemRequest itemReq : request.getItems()) {
            OrderItem item = OrderItem.builder()
                    .order(order)
                    .productId(itemReq.getProductId())
                    .productName(itemReq.getProductName())
                    .quantity(itemReq.getQuantity())
                    .unitPrice(itemReq.getUnitPrice())
                    .build();
            order.getItems().add(item);
            total = total.add(itemReq.getUnitPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())));
        }
        order.setTotalAmount(total);

        order = orderRepository.save(order);

        orderEventProducer.sendOrderEvent(OrderEvent.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .totalAmount(order.getTotalAmount())
                .eventType("ORDER_CREATED")
                .build());

        return mapToResponse(order);
    }

    public OrderResponse getById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return mapToResponse(order);
    }

    public Page<OrderResponse> getByUser(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return orderRepository.findByUserId(userId, pageable).map(this::mapToResponse);
    }

    public Page<OrderResponse> getByCompany(Long companyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return orderRepository.findByCompanyId(companyId, pageable).map(this::mapToResponse);
    }

    @Transactional
    public OrderResponse updateStatus(Long id, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        order.setStatus(request.getStatus());
        order = orderRepository.save(order);

        orderEventProducer.sendOrderEvent(OrderEvent.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .totalAmount(order.getTotalAmount())
                .eventType("ORDER_" + request.getStatus().name())
                .build());

        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Can only cancel pending orders");
        }
        order.setStatus(OrderStatus.CANCELLED);
        order = orderRepository.save(order);

        orderEventProducer.sendOrderEvent(OrderEvent.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .totalAmount(order.getTotalAmount())
                .eventType("ORDER_CANCELLED")
                .build());

        return mapToResponse(order);
    }

    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .companyId(order.getCompanyId())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .items(order.getItems().stream().map(this::mapItemToResponse).toList())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private OrderItemResponse mapItemToResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .productName(item.getProductName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .build();
    }
}
