package com.quispe.food_delivery.order.dto;

import com.quispe.food_delivery.order.entity.OrderStatus;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusRequestDto {

    @NotNull(message = "O status é obrigatório")
    private OrderStatus status;
}
