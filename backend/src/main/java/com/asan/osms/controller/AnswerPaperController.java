package com.asan.osms.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asan.osms.entity.AnswerPaper;
import com.asan.osms.entity.User;
import com.asan.osms.exception.ResourceNotFoundException;
import com.asan.osms.repository.AnswerPaperRepository;
import com.asan.osms.repository.UserRepository;

@RestController
@RequestMapping("/api")
public class AnswerPaperController {
	
	private AnswerPaperRepository repository;
	private UserRepository userRepository;
	
	AnswerPaperController(AnswerPaperRepository answerPaperRepository, UserRepository userRepository) {
		this.repository = answerPaperRepository;
		this.userRepository = userRepository;
	}
	
	@PostMapping("/answerpapers")
	AnswerPaper saveAnswerPaper(@RequestBody AnswerPaper answePaper) {
		return repository.save(answePaper);
	}
	
	@GetMapping("/answerpapers/{questionPaperID}/{studentID}")
	AnswerPaper getAnswerPaper(@PathVariable Integer questionPaperID, @PathVariable Integer studentID) {
		AnswerPaper answerPaper = null;
		
		try {
			answerPaper = repository.findByQuestionPaperAndStudent(questionPaperID, studentID);
		} catch (NoSuchElementException ex) {
			throw new ResourceNotFoundException(String.valueOf(questionPaperID));
		}
		
		if (answerPaper != null) {
			return answerPaper;
		}
		
		throw new ResourceNotFoundException(String.valueOf(questionPaperID));
	}
	
	@GetMapping("/answerpaper/{studentID}")
	List<AnswerPaper> getAnswerPapersForAStudent(@PathVariable Integer studentID) {
		List<AnswerPaper> answerPapers = null;
		
		try {
			answerPapers = repository.findByStudent(studentID);
		} catch (NoSuchElementException ex) {
			throw new ResourceNotFoundException(String.valueOf(studentID));
		}
		
		if (answerPapers != null) {
			return answerPapers;
		}
		
		throw new ResourceNotFoundException(String.valueOf(studentID));
	}
	
	@GetMapping("/answerpapers/{questionPaperID}")
	List<User> getAnswerPapersForQuestionpapers(@PathVariable Integer questionPaperID) {
		List<AnswerPaper> answerPapers = null;
		List<User> users = null;
		
		try {
			answerPapers = repository.findByQuestionPaper(questionPaperID);
		} catch (NoSuchElementException ex) {
			throw new ResourceNotFoundException(String.valueOf(questionPaperID));
		}
		
		if (answerPapers != null) {
			users = new ArrayList<User>();
			
			for (AnswerPaper ansPaper : answerPapers) {
				User user = userRepository.findById(ansPaper.getStudentID()).get();
				
				if (user != null) {
					users.add(user);
				}
			}
			
			return users;
		}
		
		throw new ResourceNotFoundException(String.valueOf(questionPaperID));
	}
	
	@PutMapping("/answerpapers/{id}")
	void updateAnswerPaperStatus(@PathVariable Integer id) {
		
		AnswerPaper oldAnswerPaper = null;
		try {
			oldAnswerPaper = repository.findById(id).get();
		} catch (NoSuchElementException ex) {
			
		}
		
		oldAnswerPaper.setStatus("Submitted");
		repository.save(oldAnswerPaper);
		
	}

}
