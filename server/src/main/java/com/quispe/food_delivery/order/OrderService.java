package com.quispe.food_delivery.order;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.quispe.food_delivery.common.exception.BusinessException;
import com.quispe.food_delivery.common.exception.ResourceNotFoundException;
import com.quispe.food_delivery.order.dto.CreateOrderRequestDto;
import com.quispe.food_delivery.order.dto.OrderResponseDto;
import com.quispe.food_delivery.order.dto.UpdateOrderStatusRequestDto;
import com.quispe.food_delivery.order.entity.Order;
import com.quispe.food_delivery.order.entity.OrderItem;
import com.quispe.food_delivery.order.entity.OrderStatus;
import com.quispe.food_delivery.order.mapper.OrderMapper;
import com.quispe.food_delivery.product.ProductRepository;
import com.quispe.food_delivery.product.entity.Product;
import com.quispe.food_delivery.user.entity.Role;
import com.quispe.food_delivery.user.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderMapper orderMapper;

    @Transactional
    public OrderResponseDto create(CreateOrderRequestDto request, User currentUser) {
        Order order = Order.builder()
                .deliveryAddress(request.getDeliveryAddress())
                .createdBy(currentUser)
                .status(OrderStatus.RECEBIDO)
                .build();

        for (CreateOrderRequestDto.OrderItemRequestDto itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com ID: " + itemRequest.getProductId()));

            if (!product.isActive()) {
                throw new BusinessException("O produto '" + product.getName() + "' não está ativo e não pode ser pedido.");
            }

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();

            order.addItem(orderItem);
        }

        Order savedOrder = orderRepository.save(order);
        return orderMapper.toResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> findAll(User currentUser) {
        List<Order> orders;
        if (currentUser.getRole() == Role.ADMIN) {
            orders = orderRepository.findAll();
        } else {
            orders = orderRepository.findAllByCreatedBy(currentUser);
        }

        return orders.stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponseDto findById(Long id, User currentUser) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com ID: " + id));

        if (currentUser.getRole() == Role.CUSTOMER && !order.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Você não tem permissão para visualizar este pedido.");
        }

        return orderMapper.toResponse(order);
    }

    @Transactional
    public OrderResponseDto updateStatus(Long id, UpdateOrderStatusRequestDto request, User currentUser) {
        if (currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Apenas administradores podem atualizar o status de um pedido.");
        }

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com ID: " + id));

        if (order.getStatus() == OrderStatus.ENTREGUE) {
            throw new BusinessException("Não é permitido alterar um pedido com status ENTREGUE.");
        }

        if (order.getStatus() == OrderStatus.CANCELADO) {
            throw new BusinessException("Não é permitido alterar o status de um pedido CANCELADO.");
        }

        order.setStatus(request.getStatus());
        Order updatedOrder = orderRepository.save(order);
        return orderMapper.toResponse(updatedOrder);
    }
}
