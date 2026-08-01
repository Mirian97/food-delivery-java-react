package com.quispe.food_delivery.user.mapper;

import org.mapstruct.Mapper;

import com.quispe.food_delivery.user.dto.UserResponseDto;
import com.quispe.food_delivery.user.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    default UserResponseDto toResponse(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponseDto(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
