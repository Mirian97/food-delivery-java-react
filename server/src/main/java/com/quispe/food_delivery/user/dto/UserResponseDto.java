package com.quispe.food_delivery.user.dto;

import com.quispe.food_delivery.user.entity.Role;
import com.quispe.food_delivery.user.entity.User;

public record UserResponseDto(
    Long id,
    String name,
    String email,
    Role role
) {
    public static UserResponseDto from(User user) {
        return new UserResponseDto(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
