package com.quispe.food_delivery.auth.dto;

import com.quispe.food_delivery.user.entity.User;

public record LoginResponseDto(
    String token,
    String name,
    String email,
    String role
) {

    public static LoginResponseDto from(String token, User user) {
        return new LoginResponseDto(token, user.getName(), user.getEmail(), user.getRole().name());
    }
}
