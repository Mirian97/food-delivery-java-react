package com.quispe.food_delivery.order;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.quispe.food_delivery.order.entity.Order;
import com.quispe.food_delivery.user.entity.User;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByCreatedBy(User createdBy);
}
