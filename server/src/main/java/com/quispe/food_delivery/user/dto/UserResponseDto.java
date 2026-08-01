package com.quispe.food_delivery.user.dto;

import com.quispe.food_delivery.user.entity.Role;

public record UserResponseDto(
    Long id,
    String name,
    String email,
    Role role
) {}
