package com.dev.e_commorce.org.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.e_commorce.org.entity.Cart;
import com.dev.e_commorce.org.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

	@Autowired
	private CartService cartService;
	
	
	@PostMapping("/{userId}/add/{productId}/{quantity}")
	public ResponseEntity<String> addToCart( @PathVariable Long userId,@PathVariable Long productId, @PathVariable Integer quantity){
		cartService.addToCart(userId, productId, quantity);
		return ResponseEntity.ok("Item added to Cart !");
	};
	
	@GetMapping("/getCart/{userId}")
	public ResponseEntity<Cart> getCart(@PathVariable Long userId){
		return ResponseEntity.ok(cartService.getCart(userId));
	}
	
	@PutMapping("/{userId}/items/{itemId}")
	public ResponseEntity<Cart> updateItemQuantity(@PathVariable Long userId, @PathVariable Long itemId, @RequestParam Integer quantity){
		return ResponseEntity.ok(cartService.updateItemQuantity(userId, itemId, quantity));
	}

	@DeleteMapping("/removeItem/{userId}/{productId}")
	public ResponseEntity<String> removeItem(@PathVariable Long userId, @PathVariable Long productId){
		cartService.removeItem(userId, productId);
		return ResponseEntity.ok("Item Removed Successfully !");
	}
}
