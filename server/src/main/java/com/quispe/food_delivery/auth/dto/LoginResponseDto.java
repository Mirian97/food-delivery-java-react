package com.quispe.food_delivery.auth.dto;

public record LoginResponseDto(
    String token,
    String name,
    String email,
    String role
) {}
