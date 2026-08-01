package com.quispe.food_delivery.product.mapper;

import org.mapstruct.Mapper;

import com.quispe.food_delivery.product.dto.ProductRequestDto;
import com.quispe.food_delivery.product.dto.ProductResponseDto;
import com.quispe.food_delivery.product.entity.Product;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    Product toEntity(ProductRequestDto request);

    ProductResponseDto toResponse(Product product);
}
