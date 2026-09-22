package com.dev.e_commorce.org.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.e_commorce.org.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long>{

	public List<Order> findByUserId(Long userId);
}
