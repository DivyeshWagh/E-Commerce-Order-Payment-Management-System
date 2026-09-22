package com.dev.e_commorce.org.repo;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.e_commorce.org.entity.Users;

public interface UserRepository extends JpaRepository<Users, Long>{

	Optional<Users> findByEmail(String email);
}
