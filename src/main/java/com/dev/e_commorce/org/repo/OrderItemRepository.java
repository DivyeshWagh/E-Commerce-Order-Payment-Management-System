package com.dev.e_commorce.org.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.e_commorce.org.entity.Order_item;

public interface OrderItemRepository extends JpaRepository<Order_item, Long>{

}
