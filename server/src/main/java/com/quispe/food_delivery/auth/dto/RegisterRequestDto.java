package com.quispe.food_delivery.auth.dto;

import com.quispe.food_delivery.user.entity.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterRequestDto(
    @NotBlank(message = "O nome é obrigatório")
    String name,

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "O e-mail deve ser válido")
    String email,

    @NotBlank(message = "A senha é obrigatória")
    String password,

    @NotNull(message = "O perfil (role) é obrigatório")
    Role role
) {}
