package com.dev.e_commorce.org.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.e_commorce.org.entity.Inventory;
import com.dev.e_commorce.org.entity.Product;
import com.dev.e_commorce.org.repo.InventoryRepository;
import com.dev.e_commorce.org.repo.ProductRepository;

@Service
@Transactional
public class InventoryService {

	@Autowired
	private InventoryRepository inventoryRepository;

	@Autowired
	private ProductRepository productRepository;

	public Inventory getInventoryByProductId(Long productId) {
		return inventoryRepository.findByProductId(productId)
				.orElseGet(() -> {
					Product product = productRepository.findById(productId)
							.orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
					Inventory inventory = new Inventory();
					inventory.setProduct(product);
					inventory.setAvailableQuantity(product.getStockQuantity() != null ? product.getStockQuantity() : 0);
					inventory.setReservedQuantity(0);
					return inventoryRepository.save(inventory);
				});
	}

	public Inventory updateStock(Long productId, Integer newAvailableStock) {
		Inventory inventory = getInventoryByProductId(productId);
		inventory.setAvailableQuantity(newAvailableStock);
		
		// Synchronize Product stockQuantity field
		Product product = inventory.getProduct();
		product.setStockQuantity(newAvailableStock);
		productRepository.save(product);

		return inventoryRepository.save(inventory);
	}

	public void reserveStock(Long productId, Integer quantity) {
		Inventory inventory = getInventoryByProductId(productId);
		if (inventory.getAvailableQuantity() < quantity) {
			throw new RuntimeException("Insufficient stock for product: " + inventory.getProduct().getName());
		}
		inventory.setAvailableQuantity(inventory.getAvailableQuantity() - quantity);
		inventory.setReservedQuantity(inventory.getReservedQuantity() + quantity);

		// Synchronize product entity
		Product product = inventory.getProduct();
		product.setStockQuantity(inventory.getAvailableQuantity());
		productRepository.save(product);

		inventoryRepository.save(inventory);
	}

	public void confirmMovement(Long productId, Integer quantity) {
		Inventory inventory = getInventoryByProductId(productId);
		inventory.setReservedQuantity(Math.max(0, inventory.getReservedQuantity() - quantity));
		inventoryRepository.save(inventory);
	}

	public void releaseReservedStock(Long productId, Integer quantity) {
		Inventory inventory = getInventoryByProductId(productId);
		inventory.setReservedQuantity(Math.max(0, inventory.getReservedQuantity() - quantity));
		inventory.setAvailableQuantity(inventory.getAvailableQuantity() + quantity);

		Product product = inventory.getProduct();
		product.setStockQuantity(inventory.getAvailableQuantity());
		productRepository.save(product);

		inventoryRepository.save(inventory);
	}

	public List<Inventory> getLowStockProducts(Integer threshold) {
		return inventoryRepository.findByAvailableQuantityLessThanEqual(threshold);
	}
}
