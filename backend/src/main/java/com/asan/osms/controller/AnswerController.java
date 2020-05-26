package com.asan.osms.controller;

import java.util.NoSuchElementException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.asan.osms.entity.Answer;
import com.asan.osms.exception.ResourceNotFoundException;
import com.asan.osms.repository.AnswerRepository;

@RestController
public class AnswerController {
	
	private final AnswerRepository repository;
	
	AnswerController(AnswerRepository answerRepository) {
		this.repository = answerRepository;
	}
	
	@PutMapping("/answers")
	Answer saveAnswer(@RequestBody Answer answer) {
		return repository.save(answer);
	}
	
	@GetMapping("/answers/{answerPaperID}/{questionID}")
	Answer gtAnswerByAnswerPaperIDAndQuestionID(@PathVariable Integer answerPaperID, @PathVariable Integer questionID) {
		Answer answer = null;
		
		try {
			answer = repository.findByAnswerPaperAndQuestion(answerPaperID, questionID);
		} catch (NoSuchElementException ex) {
			throw new ResourceNotFoundException(String.valueOf(answerPaperID));
		}
		
		if (answer != null) {
			return answer;
		}
		
		throw new ResourceNotFoundException(String.valueOf(answerPaperID));
	}

}
