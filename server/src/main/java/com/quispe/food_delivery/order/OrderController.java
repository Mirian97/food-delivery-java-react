package com.quispe.food_delivery.order;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.quispe.food_delivery.order.dto.CreateOrderRequestDto;
import com.quispe.food_delivery.order.dto.OrderResponseDto;
import com.quispe.food_delivery.order.dto.UpdateOrderStatusRequestDto;
import com.quispe.food_delivery.user.entity.User;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Tag(name = "Order", description = "Order endpoints")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponseDto> create(
            @Valid @RequestBody CreateOrderRequestDto request,
            @AuthenticationPrincipal User currentUser) {
        OrderResponseDto response = orderService.create(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> findAll(@AuthenticationPrincipal User currentUser) {
        List<OrderResponseDto> response = orderService.findAll(currentUser);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDto> findById(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        OrderResponseDto response = orderService.findById(id, currentUser);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponseDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequestDto request,
            @AuthenticationPrincipal User currentUser) {
        OrderResponseDto response = orderService.updateStatus(id, request, currentUser);
        return ResponseEntity.ok(response);
    }
}
