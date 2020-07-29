package com.asan.osms.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asan.osms.entity.School;
import com.asan.osms.repository.SchoolRepository;

@RestController
@RequestMapping("/api")
public class SchoolController {
	
	private SchoolRepository repository;
	
	SchoolController(SchoolRepository schoolRepository) {
		this.repository = schoolRepository;
	}
	
	@GetMapping("/schools")
	List<School> getAllSchools() {
		return (List<School>) repository.findAll();
	}
}
