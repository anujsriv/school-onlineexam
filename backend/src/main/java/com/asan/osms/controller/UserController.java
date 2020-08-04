package com.asan.osms.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asan.osms.entity.User;
import com.asan.osms.exception.ResourceNotFoundException;
import com.asan.osms.exception.UserAlreadyLoggedInException;
import com.asan.osms.exception.UserAlreadyLoggedOutException;
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
	
	@GetMapping("/users/{userName}")
	User getUserByUserName(@PathVariable String userName) {
		User user = null;
		try {
			user = repository.findByUserName(userName);
		} catch (NoSuchElementException ex) {
			throw new ResourceNotFoundException(String.valueOf(userName));
		}

		if (user != null) {
			return user;
		}

		throw new ResourceNotFoundException(String.valueOf(userName));
	}
	
	@GetMapping("/users/{className}/{section}")
	List<User> getAllStudentsByClassNameAndSection(@PathVariable String className, @PathVariable String section) {
		List<User> users = null;
		try {
			users = repository.findByClassNameAndSection(className, section);
		} catch (NoSuchElementException ex) {
			throw new ResourceNotFoundException(String.valueOf(className));
		}

		if (users != null) {
			return users;
		}

		throw new ResourceNotFoundException(String.valueOf(className));
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
			if (!user.getLoggedIn()) {
				user.setLoggedIn(true);
				repository.save(user);
				return user;
			} else {
				throw new UserAlreadyLoggedInException(user.getUserName());
			}
		}
		
		throw new ResourceNotFoundException(requestedUser.getUserName());
	}
	
	@PostMapping("/logout")
	void updateUserLoggedInFlag(@RequestBody User requestedUser) {
		User user = null;
		
		try {
			user = repository.findByUsernameAndPassword(requestedUser.getUserName(), requestedUser.getPassword());
		} catch (NoSuchElementException ex) {
			throw new ResourceNotFoundException(requestedUser.getUserName());
		}
		
		if (user != null) {
			if (user.getLoggedIn()) {
				user.setLoggedIn(false);
				repository.save(user);
			} else {
				throw new UserAlreadyLoggedOutException(user.getUserName());
			}
		} else {
			throw new ResourceNotFoundException(requestedUser.getUserName());
		}
	}

}
