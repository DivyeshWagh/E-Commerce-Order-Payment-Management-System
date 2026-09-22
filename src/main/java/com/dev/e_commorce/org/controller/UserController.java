package com.dev.e_commorce.org.controller;

import java.util.List;

import org.apache.logging.log4j.message.Message;
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

import com.dev.e_commorce.org.entity.Users;
import com.dev.e_commorce.org.enums.RoleType;
import com.dev.e_commorce.org.service.UserServices;

@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserServices userServices;
	
	@PostMapping("/register/{role}")
	public ResponseEntity<Users> registerUser(@RequestBody Users user, @PathVariable RoleType role){
		return ResponseEntity.ok(userServices.registerUser(user, role));
	}
	
	@GetMapping("/getallusers")
	public ResponseEntity<List<Users>> getAllUsers(){
		return ResponseEntity.ok(userServices.getAllUsers());
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Users> getByid(@PathVariable Long id){
		return ResponseEntity.ok(userServices.getUserById(id));
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteUser(@PathVariable Long id){
		userServices.deleteUser(id);
		String message = "Deleted Successfully";
		return ResponseEntity.ok(message);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Users> updateUser(@PathVariable Long id, @RequestBody Users updateUser){
		return ResponseEntity.ok(userServices.updateUser(id, updateUser));
	}
}
