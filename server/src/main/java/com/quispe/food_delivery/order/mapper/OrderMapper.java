package com.quispe.food_delivery.order.mapper;

import java.math.BigDecimal;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.quispe.food_delivery.order.dto.OrderResponseDto;
import com.quispe.food_delivery.order.entity.Order;
import com.quispe.food_delivery.order.entity.OrderItem;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target = "createdByEmail", source = "createdBy.email")
    @Mapping(target = "totalPrice", expression = "java(calculateTotalPrice(order))")
    OrderResponseDto toResponse(Order order);

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    OrderResponseDto.OrderItemResponseDto toItemResponse(OrderItem item);

    default BigDecimal calculateTotalPrice(Order order) {
        if (order == null || order.getItems() == null) {
            return BigDecimal.ZERO;
        }

        return order.getItems().stream()
            .map(item ->
                item.getUnitPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()))
            )
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}