package com.dev.e_commorce.org.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.e_commorce.org.entity.Cart_items;
import com.dev.e_commorce.org.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long>{

	List<Product> findBySellerId(Long sellerId);
	List<Product> findByNameContainingIgnoreCase(String keyword);
	List<Product> findByCategoryNameIgnoreCase(String category);
	List<Product> findByPriceBetween(Double minprice,Double maxprice);
	
	
}
