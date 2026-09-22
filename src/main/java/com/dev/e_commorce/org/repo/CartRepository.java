package com.dev.e_commorce.org.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dev.e_commorce.org.entity.Cart;
import com.dev.e_commorce.org.entity.Users;

public interface CartRepository extends JpaRepository<Cart, Long>{
	
	@Query("SELECT c FROM Cart c WHERE c.user.id = :userId")
	Optional<Cart> findByUser_Id(@Param("userId") Long userId);

}
