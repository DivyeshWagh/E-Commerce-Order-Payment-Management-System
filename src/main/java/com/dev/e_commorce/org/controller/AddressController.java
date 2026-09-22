package com.dev.e_commorce.org.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.e_commorce.org.entity.Address;
import com.dev.e_commorce.org.service.AddressService;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

	@Autowired
	private AddressService addressService;

	@PostMapping("/{userId}")
	public ResponseEntity<Address> addAddress(@PathVariable Long userId, @RequestBody Address address) {
		return ResponseEntity.ok(addressService.addAddress(userId, address));
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<List<Address>> getUserAddresses(@PathVariable Long userId) {
		return ResponseEntity.ok(addressService.getUserAddresses(userId));
	}

	@GetMapping("/{id}")
	public ResponseEntity<Address> getAddressById(@PathVariable Long id) {
		return ResponseEntity.ok(addressService.getAddressById(id));
	}

	@PutMapping("/{id}")
	public ResponseEntity<Address> updateAddress(@PathVariable Long id, @RequestBody Address addressDetails) {
		return ResponseEntity.ok(addressService.updateAddress(id, addressDetails));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteAddress(@PathVariable Long id) {
		addressService.deleteAddress(id);
		return ResponseEntity.ok("Address deleted successfully!");
	}
}
