package com.asan.osms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.asan.osms.entity.Procting;

public interface ProctingRepository extends CrudRepository<Procting, Integer> {

	@Query(value = "SELECT p FROM Procting p WHERE p.userName = ?1")
	Procting findByUserName(String userName);

	@Query(value = "SELECT p FROM Procting p WHERE p.className = ?1 and p.section = ?2 ")
	List<Procting> findByClassNameAndSection(String className, String section);

}
