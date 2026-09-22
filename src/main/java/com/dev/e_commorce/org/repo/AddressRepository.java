package com.dev.e_commorce.org.repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.dev.e_commorce.org.entity.Address;

public interface AddressRepository extends JpaRepository<Address, Long>{
	List<Address> findByUserId(Long userId);
}
