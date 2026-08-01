package com.quispe.food_delivery.product.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequestDto {

    @NotBlank(message = "O nome do produto é obrigatório")
    private String name;

    private String description;

    @NotNull(message = "O preço do produto é obrigatório")
    @Positive(message = "O preço do produto deve ser maior que zero")
    private BigDecimal price;

    private Boolean active;
}
