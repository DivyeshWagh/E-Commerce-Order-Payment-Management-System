package com.dev.e_commorce.org.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.e_commorce.org.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long>{

}
