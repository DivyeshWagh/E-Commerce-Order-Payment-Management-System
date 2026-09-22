package com.dev.e_commorce.org.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.e_commorce.org.entity.Address;
import com.dev.e_commorce.org.entity.Order;
import com.dev.e_commorce.org.enums.OrderStatus;
import com.dev.e_commorce.org.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

	@Autowired
	private OrderService orderService;

	@PostMapping("/checkout/{userId}")
	public ResponseEntity<Order> checkout(@PathVariable Long userId, @RequestBody Address address) {
		return ResponseEntity.ok(orderService.createOrder(userId, address));
	}

	@PutMapping("/{orderId}/cancel")
	public ResponseEntity<String> cancelOrder(@PathVariable Long orderId) {
		orderService.cancelOrder(orderId);
		return ResponseEntity.ok("Order cancelled successfully!");
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable Long userId) {
		return ResponseEntity.ok(orderService.getOrderByUser(userId));
	}

	@GetMapping("/{orderId}/user/{userId}")
	public ResponseEntity<Order> getOrderById(@PathVariable Long orderId, @PathVariable Long userId) {
		return ResponseEntity.ok(orderService.getOrderById(userId, orderId));
	}

	@PutMapping("/admin/{orderId}/status")
	public ResponseEntity<Order> updateOrderStatusAdmin(@PathVariable Long orderId, @RequestParam OrderStatus status) {
		return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
	}
}
