package com.yensao.cart.controller;

import com.yensao.cart.dto.*;
import com.yensao.cart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<CartResponse> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @PostMapping("/{userId}/items")
    public ResponseEntity<CartResponse> addItem(@PathVariable Long userId,
                                                 @Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addItem(userId, request));
    }

    @PutMapping("/{userId}/items/{productId}")
    public ResponseEntity<CartResponse> updateQuantity(@PathVariable Long userId,
                                                        @PathVariable Long productId,
                                                        @Valid @RequestBody UpdateQuantityRequest request) {
        return ResponseEntity.ok(cartService.updateItemQuantity(userId, productId, request));
    }

    @DeleteMapping("/{userId}/items/{productId}")
    public ResponseEntity<CartResponse> removeItem(@PathVariable Long userId,
                                                    @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeItem(userId, productId));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}
