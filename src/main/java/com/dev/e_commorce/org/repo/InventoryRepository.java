package com.dev.e_commorce.org.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.e_commorce.org.entity.Inventory;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
	Optional<Inventory> findByProductId(Long productId);
	List<Inventory> findByAvailableQuantityLessThanEqual(Integer threshold);
}
