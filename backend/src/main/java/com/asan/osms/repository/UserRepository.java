package com.asan.osms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.asan.osms.entity.User;

public interface UserRepository extends CrudRepository<User, Integer> {
	
	@Query(value = "SELECT u FROM User u WHERE u.userName = ?1 AND u.password = ?2")
	User findByUsernameAndPassword(String userName, String password);

	@Query(value = "SELECT u FROM User u WHERE u.userName = ?1")
	User findByUserName(String userName);

	@Query(value = "SELECT u FROM User u WHERE u.className = ?1 AND u.section = ?2 and u.type='student' ")
	List<User> findByClassNameAndSection(String className, String section);
}
