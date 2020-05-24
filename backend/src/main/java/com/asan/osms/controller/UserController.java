package com.asan.osms.controller;

import java.util.NoSuchElementException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.asan.osms.entity.User;
import com.asan.osms.repository.UserRepository;

@RestController
public class UserController {
	
	private final UserRepository repository;
	
	UserController(UserRepository userRepository) {
		this.repository = userRepository;
	}
	
	@PutMapping("/users")
	Integer saveUser(@RequestBody User user) {
		return repository.save(user).getId();
	}
	
	@GetMapping("/users/{userName}/{password}")
	User getByUsernameAndPassword(@PathVariable String userName, @PathVariable String password) {
		User user = null;
		
		try {
			user = repository.findByUsernameAndPassword(userName, password);
		} catch (NoSuchElementException ex) {
			
		}
		
		return user;
	}

}
