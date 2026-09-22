package com.dev.e_commorce.org.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.e_commorce.org.entity.Payment;
import com.dev.e_commorce.org.enums.PaymentMethod;
import com.dev.e_commorce.org.enums.PaymentStatus;
import com.dev.e_commorce.org.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

	@Autowired
	private PaymentService paymentService;
	
	@PostMapping("/initiate")
	public ResponseEntity<Payment> initiatePayment(@RequestParam Long orderId, @RequestParam PaymentMethod method){
		return ResponseEntity.ok(paymentService.initiatePayment(orderId, method));
	}
	
	@PutMapping("/{paymentId}/status")
	public ResponseEntity<Payment> updatePaymentStatus(@PathVariable Long paymentId, @RequestParam PaymentStatus status){
		return ResponseEntity.ok(paymentService.updatePaymentStatus(paymentId, status));
	}
}
