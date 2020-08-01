package com.asan.osms.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asan.osms.entity.Answer;
import com.asan.osms.exception.ResourceNotFoundException;
import com.asan.osms.repository.AnswerRepository;

@RestController
@RequestMapping("/api")
public class AnswerController {
	
	private final AnswerRepository repository;
	
	AnswerController(AnswerRepository answerRepository) {
		this.repository = answerRepository;
	}
	
	@PostMapping("/answers")
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
	
	@GetMapping("/answers/{answerPaperID}")
	List<Answer> gtAnswersByAnswerPaperID(@PathVariable Integer answerPaperID) {
		List<Answer> answers = null;
		
		try {
			answers = repository.findByAnswerPaper(answerPaperID);
		} catch (NoSuchElementException ex) {
			throw new ResourceNotFoundException(String.valueOf(answerPaperID));
		}
		
		if (answers != null) {
			return answers;
		}
		
		throw new ResourceNotFoundException(String.valueOf(answerPaperID));
	}
	
	@PutMapping("/answers")
	Answer updateAnswer(@RequestBody Answer updatedanswer) {
		Answer answer = null;
		
		try {
			answer = repository.findById(updatedanswer.getId()).get();
		} catch (NoSuchElementException ex) {
			throw new ResourceNotFoundException(String.valueOf(updatedanswer.getId()));
		}
		
		if (answer != null) {
			answer.setCorrectIncorrect(updatedanswer.getCorrectIncorrect());
			answer.setMarksObtained(updatedanswer.getMarksObtained());
			repository.save(answer);
			return answer;
		}
		
		throw new ResourceNotFoundException(String.valueOf(updatedanswer.getId()));
	}

}
