package com.dev.e_commorce.org.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.dev.e_commorce.org.enums.OrderStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")

public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	private Users user;
	
	
	@OneToMany(mappedBy = "order",cascade = CascadeType.ALL,orphanRemoval = true )
	private Set<Order_item> items= new HashSet<Order_item>();
	
	private double subtotal;
    private double tax;
	
	@Column(nullable = false)
	private Double totalprice;
	
	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private OrderStatus status;
	
	@ManyToOne
	private Address shippingAddress;
	
	@Column(nullable = false)
	private LocalDateTime createdAt;
}
