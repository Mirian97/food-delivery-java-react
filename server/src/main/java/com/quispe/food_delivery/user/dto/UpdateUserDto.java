package com.quispe.food_delivery.user.dto;

import com.quispe.food_delivery.user.entity.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateUserDto(
    @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres")
    String name,

    @Email(message = "E-mail inválido")
    String email,

    @Size(min = 8, max = 255, message = "A senha deve ter pelo menos 8 caracteres")
    String password,

    Role role
) {
}