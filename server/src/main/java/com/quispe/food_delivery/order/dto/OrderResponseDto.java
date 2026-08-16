package com.quispe.food_delivery.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.quispe.food_delivery.order.entity.OrderStatus;

public record OrderResponseDto(
    Long id,
    OrderStatus status,
    String deliveryAddress,
    String createdByEmail,
    List<OrderItemResponseDto> items,
    BigDecimal totalPrice,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {

    public static record OrderItemResponseDto(
        Long productId,
        String productName,
        Integer quantity,
        BigDecimal unitPrice
    ) {}
}
