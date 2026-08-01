package com.quispe.food_delivery.auth.mapper;

import org.mapstruct.Mapper;

import com.quispe.food_delivery.auth.dto.LoginResponseDto;
import com.quispe.food_delivery.auth.dto.RegisterRequestDto;
import com.quispe.food_delivery.user.dto.UserResponseDto;
import com.quispe.food_delivery.user.entity.User;

@Mapper(componentModel = "spring")
public interface AuthMapper {

    User toUserEntity(RegisterRequestDto registerRequest);

    default UserResponseDto toUserResponse(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponseDto(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    default LoginResponseDto toLoginResponse(User user, String token) {
        if (user == null) {
            return null;
        }
        return new LoginResponseDto(token, user.getName(), user.getEmail(), user.getRole() != null ? user.getRole().name() : null);
    }
}
