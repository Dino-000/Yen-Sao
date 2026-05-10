package com.yensao.cart.service;

import com.yensao.cart.dto.*;
import com.yensao.cart.model.Cart;
import com.yensao.cart.model.CartItem;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class CartService {

    private static final String CART_KEY_PREFIX = "cart:";
    private static final long CART_TTL_DAYS = 7;

    private final RedisTemplate<String, Object> redisTemplate;

    public CartResponse getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return buildCartResponse(cart);
    }

    public CartResponse addItem(Long userId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(userId);

        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(request.getProductId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            existingItem.setPrice(request.getPrice());
        } else {
            CartItem newItem = CartItem.builder()
                    .productId(request.getProductId())
                    .productName(request.getProductName())
                    .price(request.getPrice())
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(newItem);
        }

        saveCart(userId, cart);
        return buildCartResponse(cart);
    }

    public CartResponse updateItemQuantity(Long userId, Long productId, UpdateQuantityRequest request) {
        Cart cart = getOrCreateCart(userId);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        item.setQuantity(request.getQuantity());
        saveCart(userId, cart);
        return buildCartResponse(cart);
    }

    public CartResponse removeItem(Long userId, Long productId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        saveCart(userId, cart);
        return buildCartResponse(cart);
    }

    public void clearCart(Long userId) {
        redisTemplate.delete(CART_KEY_PREFIX + userId);
    }

    private Cart getOrCreateCart(Long userId) {
        String key = CART_KEY_PREFIX + userId;
        Object cached = redisTemplate.opsForValue().get(key);
        if (cached instanceof Cart cart) {
            return cart;
        }
        return Cart.builder().userId(userId).items(new ArrayList<>()).build();
    }

    private void saveCart(Long userId, Cart cart) {
        String key = CART_KEY_PREFIX + userId;
        redisTemplate.opsForValue().set(key, cart, CART_TTL_DAYS, TimeUnit.DAYS);
    }

    private CartResponse buildCartResponse(Cart cart) {
        int totalItems = cart.getItems().stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
        BigDecimal totalPrice = cart.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .userId(cart.getUserId())
                .items(cart.getItems())
                .totalItems(totalItems)
                .totalPrice(totalPrice)
                .build();
    }
}
