package com.quispe.food_delivery.order.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequestDto {

    @NotBlank(message = "O endereço de entrega é obrigatório")
    private String deliveryAddress;

    @NotEmpty(message = "O pedido deve ter pelo menos um item")
    @Valid
    private List<OrderItemRequestDto> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemRequestDto {
        @NotNull(message = "O ID do produto é obrigatório")
        private Long productId;

        @NotNull(message = "A quantidade é obrigatória")
        @Min(value = 1, message = "A quantidade mínima é 1")
        private Integer quantity;
    }
}
