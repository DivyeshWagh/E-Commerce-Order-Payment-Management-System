package com.dev.e_commorce.org.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.e_commorce.org.entity.Address;
import com.dev.e_commorce.org.entity.Users;
import com.dev.e_commorce.org.repo.AddressRepository;
import com.dev.e_commorce.org.repo.UserRepository;

@Service
@Transactional
public class AddressService {

	@Autowired
	private AddressRepository addressRepository;

	@Autowired
	private UserRepository userRepository;

	public Address addAddress(Long userId, Address address) {
		Users user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
		address.setUser(user);
		return addressRepository.save(address);
	}

	public List<Address> getUserAddresses(Long userId) {
		return addressRepository.findByUserId(userId);
	}

	public Address getAddressById(Long id) {
		return addressRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Address not found with id: " + id));
	}

	public Address updateAddress(Long id, Address addressDetails) {
		Address address = getAddressById(id);
		address.setStreet(addressDetails.getStreet());
		address.setCity(addressDetails.getCity());
		address.setState(addressDetails.getState());
		address.setZipcode(addressDetails.getZipcode());
		address.setCountry(addressDetails.getCountry());
		return addressRepository.save(address);
	}

	public void deleteAddress(Long id) {
		Address address = getAddressById(id);
		addressRepository.delete(address);
	}
}
