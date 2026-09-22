package com.dev.e_commorce.org.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.e_commorce.org.entity.Inventory;
import com.dev.e_commorce.org.service.InventoryService;

@RestController
@RequestMapping("/api/admin/inventory")
public class InventoryController {

	@Autowired
	private InventoryService inventoryService;

	@GetMapping("/{productId}")
	public ResponseEntity<Inventory> getInventory(@PathVariable Long productId) {
		return ResponseEntity.ok(inventoryService.getInventoryByProductId(productId));
	}

	@PutMapping("/{productId}")
	public ResponseEntity<Inventory> updateStock(
			@PathVariable Long productId,
			@RequestParam Integer availableQuantity) {
		return ResponseEntity.ok(inventoryService.updateStock(productId, availableQuantity));
	}

	@GetMapping("/low-stock")
	public ResponseEntity<List<Inventory>> getLowStockProducts(@RequestParam(defaultValue = "5") Integer threshold) {
		return ResponseEntity.ok(inventoryService.getLowStockProducts(threshold));
	}
}
