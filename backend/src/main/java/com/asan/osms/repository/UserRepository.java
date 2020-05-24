package com.asan.osms.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.asan.osms.entity.User;

public interface UserRepository extends CrudRepository<User, Integer> {
	
	@Query(value = "SELECT u FROM User u WHERE u.userName = ?1 AND u.password = ?2")
	User findByUsernameAndPassword(String userName, String password);
}
