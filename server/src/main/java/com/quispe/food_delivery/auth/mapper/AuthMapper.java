package com.quispe.food_delivery.auth.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.quispe.food_delivery.auth.dto.RegisterRequestDto;
import com.quispe.food_delivery.user.entity.User;

@Mapper(componentModel = "spring")
public interface AuthMapper {
    
    @Mapping(target= "role", ignore = true)
    User toEntity(RegisterRequestDto registerRequest);
}
