package com.quispe.food_delivery.order.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record CreateOrderRequestDto(
    @NotBlank(message = "O endereço de entrega é obrigatório")
    String deliveryAddress,

    @NotEmpty(message = "O pedido deve ter pelo menos um item")
    @Valid
    List<OrderItemRequestDto> items
) {

    public record OrderItemRequestDto(
        @NotNull(message = "O ID do produto é obrigatório")
        Long productId,

        @NotNull(message = "A quantidade é obrigatória")
        @Min(value = 1, message = "A quantidade mínima é 1")
        Integer quantity
      ) {}
}
