package com.dev.e_commorce.org.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.e_commorce.org.entity.Cart_items;

public interface CartItemRepository extends JpaRepository<Cart_items, Long>{

}
