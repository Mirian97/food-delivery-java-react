package com.quispe.food_delivery.order.dto;

import com.quispe.food_delivery.order.entity.OrderStatus;

import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequestDto (
    @NotNull(message = "O status é obrigatório")
    OrderStatus status
) {}
