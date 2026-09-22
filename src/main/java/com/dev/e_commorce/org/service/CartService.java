package com.dev.e_commorce.org.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.e_commorce.org.entity.Cart;
import com.dev.e_commorce.org.entity.Cart_items;
import com.dev.e_commorce.org.entity.Product;
 
import com.dev.e_commorce.org.repo.CartRepository;
import com.dev.e_commorce.org.repo.ProductRepository;
import com.dev.e_commorce.org.repo.UserRepository;
import com.dev.e_commorce.org.entity.Users;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CartService {

	@Autowired
	private ProductRepository productRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private CartRepository cartRepository;
	
	public Cart addToCart(Long userId, Long productId, Integer quantity) {
	    Cart cart = cartRepository.findByUser_Id(userId)
	            .orElseGet(() -> {
	                Users user = userRepository.findById(userId)
	                        .orElseThrow(() -> new RuntimeException("User not found !"));
	                
	             
	                Cart newCart = new Cart();
	                newCart.setUser(user);
	                return cartRepository.save(newCart);
	            });

	    Product product = productRepository.findById(productId)
	            .orElseThrow(() -> new RuntimeException("Product not available !"));
	    
	    if (product.getStockQuantity()<quantity) {
	    	throw new RuntimeException("Not enough Stock available");
	    }

	    Optional<Cart_items> existingItem = cart.getItems().stream()
	            .filter(item -> item.getProduct().getId().equals(productId))
	            .findFirst();

	    if (existingItem.isPresent()) {
	        existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
	    } else {
	        Cart_items item = new Cart_items();
	        item.setCart(cart);
	        item.setProduct(product);
	        item.setQuantity(quantity);
	        item.setPrice(product.getPrice());
	        cart.getItems().add(item);
	    }

	    return cartRepository.save(cart);
	}

	public Cart getCart(Long userId) {
		Cart cart = cartRepository.findByUser_Id(userId).orElseThrow(()-> new RuntimeException("Cart not found !"));
		return cart;
	}
	
	public void removeItem(Long userId, Long productId) {
		Cart cart = cartRepository.findByUser_Id(userId).orElseThrow(()->new RuntimeException("Cart not Found "));
		cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
		cartRepository.save(cart);
		
	}
	
	public Cart updateItemQuantity(Long userId, Long itemId, Integer quantity) {
		Cart cart = cartRepository.findByUser_Id(userId).orElseThrow(()-> new RuntimeException("Cart Not Found"));
		cart.getItems().stream()
		.filter(item -> item.getId().equals(itemId))
		.findFirst()
		.ifPresent(item->item.setQuantity(quantity));
		
		return cartRepository.save(cart);
		
	}
	
}
