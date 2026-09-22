package com.dev.e_commorce.org.service;

import java.util.HashSet;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.e_commorce.org.entity.Cart;
import com.dev.e_commorce.org.entity.Roles;
import com.dev.e_commorce.org.entity.Users;
import com.dev.e_commorce.org.enums.RoleType;
import com.dev.e_commorce.org.repo.CartRepository;
import com.dev.e_commorce.org.repo.RoleRepository;
import com.dev.e_commorce.org.repo.UserRepository;

@Service
public class UserServices {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private CartRepository cartRepository;
	
	@Autowired
	private RoleRepository roleRepository;
	
	public Users registerUser(Users user, RoleType roletype) {
	    Roles role = roleRepository.findByRoleType(roletype)
	            .orElseThrow(() -> new RuntimeException("Role not Found"));

	    if (user.getRoles() == null) {
	        user.setRoles(new HashSet<>());
	    }
	    user.getRoles().add(role);

	    // Save user first
	    Users savedUser = userRepository.save(user);

	    // Create cart and link both sides
	    Cart cart = new Cart();
	    cart.setUser(savedUser);
	    cart.setItems(new HashSet<>());
	    savedUser.setCart(cart); // link both sides

	    // ✅ Only save user, cascade will persist cart
	    return userRepository.save(savedUser);
	}


	
	public List<Users> getAllUsers(){
		return userRepository.findAll();
	}
	
	public Users getUserById(Long id){
		return userRepository.findById(id).orElseThrow(()->new RuntimeException("User not Found"));
	}
	
	public void deleteUser(Long id) {
		userRepository.deleteById(id);
	}
	
	public Users updateUser(Long id, Users updateUser) {
		Users user = userRepository.getById(id);
		user.setEmail(updateUser.getEmail());
		user.setName(updateUser.getName());
		user.setPassword(updateUser.getPassword());
		return userRepository.save(user);
	}
}
