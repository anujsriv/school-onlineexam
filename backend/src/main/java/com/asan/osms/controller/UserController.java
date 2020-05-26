package com.asan.osms.controller;

import java.util.NoSuchElementException;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.asan.osms.entity.User;
import com.asan.osms.exception.ResourceNotFoundException;
import com.asan.osms.repository.UserRepository;

@RestController
public class UserController {
	
	private final UserRepository repository;
	
	UserController(UserRepository userRepository) {
		this.repository = userRepository;
	}
	
	@PostMapping("/users")
	Integer saveUser(@RequestBody User user) {
		return repository.save(user).getId();
	}
	
	@PostMapping("/login")
	User getByUsernameAndPassword(@RequestBody User requestedUser) {
		User user = null;
		
		try {
			user = repository.findByUsernameAndPassword(requestedUser.getUserName(), requestedUser.getPassword());
		} catch (NoSuchElementException ex) {
			throw new ResourceNotFoundException(requestedUser.getUserName());
		}
		
		if (user != null) {
			return user;
		}
		
		throw new ResourceNotFoundException(requestedUser.getUserName());
	}

}
