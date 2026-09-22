package com.dev.e_commorce.org.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.e_commorce.org.entity.Roles;
import com.dev.e_commorce.org.entity.Users;
import com.dev.e_commorce.org.enums.RoleType;
import com.dev.e_commorce.org.repo.RoleRepository;
import com.dev.e_commorce.org.repo.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private CustomUserDetailsService customUserDetailsService;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private RoleRepository roleRepository;
	
	@Autowired
	private PasswordEncoder encoder;
	
	
	@PostMapping("/register/{roleType}")
	public ResponseEntity<String> register(@RequestBody Users user,
			@PathVariable RoleType roleType){
		if(userRepository.findByEmail(user.getEmail()).isPresent()) {
			return ResponseEntity.badRequest().body("Email already Exists");
		}
		
		user.setPassword(encoder.encode(user.getPassword()));
		Roles role = roleRepository.findByRoleType(roleType)
				.orElseThrow(()-> new RuntimeException("Role not found :"+ roleType));
		user.getRoles().add(role);
		userRepository.save(user);
		return ResponseEntity.ok("User Registered Successfully with role: "+roleType);
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Users loginUser){
		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginUser.getEmail(), loginUser.getPassword())
				);
		UserDetails userDetails = customUserDetailsService.loadUserByUsername(loginUser.getEmail());
		String token = jwtUtil.generateToken(userDetails);
		Users user = userRepository.findByEmail(loginUser.getEmail())
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		java.util.Map<String, Object> response = new java.util.HashMap<>();
		response.put("token", token);
		response.put("userId", user.getId());
		response.put("email", user.getEmail());
		response.put("roles", user.getRoles().stream().map(r -> r.getRoleType().name()).collect(java.util.stream.Collectors.toList()));
		
		return ResponseEntity.ok(response);
	}
}
