package com.dev.e_commorce.org.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.e_commorce.org.entity.Product;
import com.dev.e_commorce.org.service.ProductService;

@RequestMapping("/api/products")
@RestController
public class ProductController {

	@Autowired
	private ProductService productService;
	
	@PostMapping("/addproduct")
	public ResponseEntity<String> addProduct(@RequestBody Product newprod){
		productService.addProduct(newprod);
		return ResponseEntity.ok("Product added Successfully!");
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Product> getProductById(@PathVariable Long id){
		return ResponseEntity.ok(productService.getProductById(id));
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<String> updateProduct(@PathVariable Long id, @RequestBody Product newprod){
		productService.updateProduct(id, newprod);
		return ResponseEntity.ok("Product Updated Successfully !");
	}
	
	@GetMapping("/getAllprod")
	public ResponseEntity<List<Product>> getAllprod(){
		return ResponseEntity.ok(productService.getAllProd());
	}
	
	@GetMapping("/getbyseller/{id}")
	public ResponseEntity<List<Product>> getprodbyseller(@PathVariable Long id){
		return ResponseEntity.ok(productService.getBySeller(id));
	}
	
	@DeleteMapping("/deleteProduct/{productId}")
	public ResponseEntity<String> deleteProduct(@PathVariable Long productId){
		productService.deleteProduct(productId);
		return ResponseEntity.ok("Product Deleted Successfully");
	}
	
	 @GetMapping(params = "search")
	public ResponseEntity<List<Product>> searchProducts(@RequestParam String search){
		return ResponseEntity.ok(productService.searchProduct(search));
	}
	
	@GetMapping(params = "category")
	public ResponseEntity<List<Product>> getProductsByCategory(@RequestParam String category){
		return ResponseEntity.ok(productService.getProductByCategory(category));
	}
	
	@GetMapping(params = {"minPrice", "maxPrice"})
	public ResponseEntity<List<Product>> getProductsByRange(
			@RequestParam Double minPrice,
			@RequestParam Double maxPrice
			){
		return ResponseEntity.ok(productService.getProductByPriceRange(minPrice, maxPrice));
	}
	
	@GetMapping("/paged")
	public ResponseEntity<Page<Product>> getPagedProducts(
	            @RequestParam(defaultValue = "0") int page,
	            @RequestParam(defaultValue = "10") int size,
	            @RequestParam(defaultValue = "id") String sortBy,
	            @RequestParam(defaultValue = "asc") String direction) {
	        return ResponseEntity.ok(productService.getPagedProducts(page, size, sortBy, direction));
	    }
	
}
