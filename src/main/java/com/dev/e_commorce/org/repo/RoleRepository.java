package com.dev.e_commorce.org.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.e_commorce.org.entity.Roles;
import com.dev.e_commorce.org.enums.RoleType;

public interface RoleRepository extends JpaRepository<Roles, Long>{

	Optional<Roles> findByRoleType(RoleType roleType);
}
