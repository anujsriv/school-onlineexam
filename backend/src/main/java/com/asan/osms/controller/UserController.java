package com.asan.osms.controller;

import java.util.NoSuchElementException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asan.osms.entity.User;
import com.asan.osms.exception.ResourceNotFoundException;
import com.asan.osms.repository.UserRepository;

@RestController
@RequestMapping("/api")
public class UserController {
	
	private final UserRepository repository;
	
	UserController(UserRepository userRepository) {
		this.repository = userRepository;
	}
	
	@PostMapping("/users")
	User saveUser(@RequestBody User user) {
		return repository.save(user);
	}
	
	@GetMapping("/user/{id}")
	User getUser(@PathVariable Integer id) {
		User user = null;
		try {
			user = repository.findById(id).get();
		} catch (NoSuchElementException ex) {
			throw new ResourceNotFoundException(String.valueOf(id));
		}

		if (user != null) {
			return user;
		}

		throw new ResourceNotFoundException(String.valueOf(id));
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
