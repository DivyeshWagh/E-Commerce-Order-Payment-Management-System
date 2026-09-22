package com.dev.e_commorce.org.entity;

import java.time.LocalDateTime;

import com.dev.e_commorce.org.enums.PaymentMethod;
import com.dev.e_commorce.org.enums.PaymentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "payments")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Payment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@OneToOne
	@JoinColumn(name = "order_id", referencedColumnName = "id")
	private Order order;
	
	@Enumerated(EnumType.STRING)
	private PaymentMethod method;
	
	@Enumerated(EnumType.STRING)
	private PaymentStatus status;
	
	@Column(nullable = false)
	private Double amount;
	
	private LocalDateTime createdAt;
}
