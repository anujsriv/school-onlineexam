package com.asan.osms.controller;

import java.util.NoSuchElementException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.asan.osms.entity.AnswerPaper;
import com.asan.osms.repository.AnswerPaperRepository;

@RestController
public class AnswerPaperController {
	
	private AnswerPaperRepository repository;
	
	AnswerPaperController(AnswerPaperRepository answerPaperRepository) {
		this.repository = answerPaperRepository;
	}
	
	@PostMapping("/answerpapers")
	Integer saveAnswerPaper(@RequestBody AnswerPaper answePaper) {
		return repository.save(answePaper).getId();
	}
	
	@GetMapping("/answerpapers/{questionPaperID}/{studentID}")
	AnswerPaper getAnswerPaper(@PathVariable Integer questionPaperID, @PathVariable Integer studentID) {
		AnswerPaper answerPaper = null;
		
		try {
			answerPaper = repository.findByQuestionPaperAndStudent(questionPaperID, studentID);
		} catch (NoSuchElementException ex) {
			
		}
		
		return answerPaper;
	}

}
