package com.dev.e_commorce.org.service;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.dev.e_commorce.org.entity.Product;
import com.dev.e_commorce.org.repo.ProductRepository;

@Service
@org.springframework.transaction.annotation.Transactional
public class ProductService {

	@Autowired
	private ProductRepository productRepository;
	
	public Product addProduct(Product newprod) {
		return productRepository.save(newprod);
	}
	
	public Product getProductById(Long id) {
		return productRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
	}

	public Product updateProduct(Long id, Product updatedprod) {
		Product oldprod = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found !"));
		oldprod.setName(updatedprod.getName());
		oldprod.setDescription(updatedprod.getDescription());
		oldprod.setPrice(updatedprod.getPrice());
		oldprod.setStockQuantity(updatedprod.getStockQuantity());
		return productRepository.save(oldprod);	
	}
	
	public void deleteProduct(Long id) {
		Product prod = getProductById(id);
		productRepository.delete(prod);
	}
	
	public List<Product> getAllProd(){
		return productRepository.findAll();
	}
	
	public List<Product> getBySeller(Long sellerId){
		return productRepository.findBySellerId(sellerId);
	}
	
	public List<Product> searchProduct(String keyword){
		return productRepository.findByNameContainingIgnoreCase(keyword);
	}
	public List<Product> getProductByCategory(String category){
		return productRepository.findByCategoryNameIgnoreCase(category);
	}
	public List<Product> getProductByPriceRange(Double minprice, Double maxprice){
		return productRepository.findByPriceBetween(minprice, maxprice);
	}
    public Page<Product> getPagedProducts(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return productRepository.findAll(pageable);
    }

}
