package com.dev.e_commorce.org.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.e_commorce.org.entity.Order;
import com.dev.e_commorce.org.entity.Order_item;
import com.dev.e_commorce.org.entity.Payment;
import com.dev.e_commorce.org.enums.OrderStatus;
import com.dev.e_commorce.org.enums.PaymentMethod;
import com.dev.e_commorce.org.enums.PaymentStatus;
import com.dev.e_commorce.org.repo.OrderRepository;
import com.dev.e_commorce.org.repo.PaymentRepository;

@Service
@Transactional
public class PaymentService {

	@Autowired
	private PaymentRepository paymentRepository;

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private InventoryService inventoryService;

	public Payment initiatePayment(Long orderId, PaymentMethod method) {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
		
		Payment payment = new Payment();
		payment.setOrder(order);
		payment.setAmount(order.getTotalprice());
		payment.setMethod(method);
		payment.setStatus(PaymentStatus.PENDING);
		payment.setCreatedAt(LocalDateTime.now());

		return paymentRepository.save(payment);
	}

	public Payment updatePaymentStatus(Long paymentId, PaymentStatus status) {
		Payment payment = paymentRepository.findById(paymentId)
				.orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));

		payment.setStatus(status);
		Order order = payment.getOrder();

		if (status == PaymentStatus.SUCCESS) {
			order.setStatus(OrderStatus.CONFIRMED);
			// Confirm inventory movement for each ordered item
			for (Order_item item : order.getItems()) {
				inventoryService.confirmMovement(item.getProduct().getId(), item.getQuantity());
			}
		} else if (status == PaymentStatus.FAILED || status == PaymentStatus.REFUNDED) {
			order.setStatus(OrderStatus.CANCELLED);
			// Release reserved inventory back to available stock
			for (Order_item item : order.getItems()) {
				inventoryService.releaseReservedStock(item.getProduct().getId(), item.getQuantity());
			}
		}

		orderRepository.save(order);
		return paymentRepository.save(payment);
	}
}
