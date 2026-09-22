package com.dev.e_commorce.org.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.e_commorce.org.entity.Address;
import com.dev.e_commorce.org.entity.Cart;
import com.dev.e_commorce.org.entity.Cart_items;
import com.dev.e_commorce.org.entity.Order;
import com.dev.e_commorce.org.entity.Order_item;
import com.dev.e_commorce.org.enums.OrderStatus;
import com.dev.e_commorce.org.repo.CartRepository;
import com.dev.e_commorce.org.repo.OrderRepository;

@Service
@Transactional
public class OrderService {

	@Autowired
	private CartRepository cartRepository;

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private InventoryService inventoryService;

	public Order createOrder(Long userId, Address address) {
		Cart cart = cartRepository.findByUser_Id(userId)
				.orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));

		if (cart.getItems().isEmpty()) {
			throw new RuntimeException("Cart is empty");
		}
		if (address == null) {
			throw new RuntimeException("Shipping address is required");
		}

		Order order = new Order();
		order.setUser(cart.getUser());
		order.setShippingAddress(address);
		order.setStatus(OrderStatus.PENDING);
		order.setCreatedAt(LocalDateTime.now());

		double subtotal = 0;

		for (Cart_items cartItem : cart.getItems()) {
			// Reserve inventory
			inventoryService.reserveStock(cartItem.getProduct().getId(), cartItem.getQuantity());

			Order_item orderItem = new Order_item();
			orderItem.setProduct(cartItem.getProduct());
			orderItem.setQuantity(cartItem.getQuantity());
			orderItem.setPrice(cartItem.getProduct().getPrice());
			orderItem.setOrder(order);

			order.getItems().add(orderItem);
			subtotal += cartItem.getProduct().getPrice() * cartItem.getQuantity();
		}

		double tax = subtotal * 0.1;
		double total = subtotal + tax;

		order.setSubtotal(subtotal);
		order.setTax(tax);
		order.setTotalprice(total);

		// Clear cart after order creation
		cart.getItems().clear();
		cartRepository.save(cart);

		return orderRepository.save(order);
	}

	public List<Order> getOrderByUser(Long userId) {
		return orderRepository.findByUserId(userId);
	}

	public Order updateOrderStatus(Long orderId, OrderStatus status) {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
		order.setStatus(status);
		return orderRepository.save(order);
	}

	public void cancelOrder(Long orderId) {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

		if (order.getStatus() == OrderStatus.CANCELLED) {
			return; // Already cancelled
		}

		order.setStatus(OrderStatus.CANCELLED);

		for (Order_item item : order.getItems()) {
			inventoryService.releaseReservedStock(item.getProduct().getId(), item.getQuantity());
		}

		orderRepository.save(order);
	}

	public Order getOrderById(Long userId, Long id) {
		Order order = orderRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
		if (!order.getUser().getId().equals(userId)) {
			throw new RuntimeException("Unauthorized Access to order: " + id);
		}
		return order;
	}
}
