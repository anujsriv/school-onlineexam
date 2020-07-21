package com.asan.osms.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.asan.osms.entity.Procting;

public interface ProctingRepository extends CrudRepository<Procting, Integer> {

	@Query(value = "SELECT p FROM Procting p WHERE p.userName = ?1")
	Procting findByUserName(String userName);

}
