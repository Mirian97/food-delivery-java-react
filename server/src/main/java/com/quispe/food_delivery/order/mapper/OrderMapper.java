package com.quispe.food_delivery.order.mapper;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;

import com.quispe.food_delivery.order.dto.OrderResponseDto;
import com.quispe.food_delivery.order.entity.Order;
import com.quispe.food_delivery.order.entity.OrderItem;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    default OrderResponseDto toResponse(Order order) {
        if (order == null) {
            return null;
        }

        BigDecimal totalPrice = order.getItems().stream()
            .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<OrderResponseDto.OrderItemResponseDto> items = order.getItems().stream()
            .map(this::toItemResponse)
            .collect(Collectors.toList());

        return OrderResponseDto.builder()
            .id(order.getId())
            .status(order.getStatus())
            .deliveryAddress(order.getDeliveryAddress())
            .createdByEmail(order.getCreatedBy() != null ? order.getCreatedBy().getEmail() : null)
            .items(items)
            .totalPrice(totalPrice)
            .createdAt(order.getCreatedAt())
            .updatedAt(order.getUpdatedAt())
            .build();
    }

    default OrderResponseDto.OrderItemResponseDto toItemResponse(OrderItem item) {
        if (item == null) {
            return null;
        }

        return OrderResponseDto.OrderItemResponseDto.builder()
            .productId(item.getProduct() != null ? item.getProduct().getId() : null)
            .productName(item.getProduct() != null ? item.getProduct().getName() : null)
            .quantity(item.getQuantity())
            .unitPrice(item.getUnitPrice())
            .build();
    }
}
