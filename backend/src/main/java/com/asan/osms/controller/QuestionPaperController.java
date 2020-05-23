package com.asan.osms.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.asan.osms.entity.QuestionPaper;
import com.asan.osms.repository.QuestionPaperRepository;

@RestController
public class QuestionPaperController {
	
	private final QuestionPaperRepository repository;
	
	QuestionPaperController(QuestionPaperRepository questionPaperRepository) {
		this.repository = questionPaperRepository;
	}
	
	@GetMapping("/questionpapers")
	List<QuestionPaper> getAllQuestionPaper() {
		return (List<QuestionPaper>) repository.findAll();
	}
	
	@PostMapping("/questionpapers")
	Integer newQuestionPaper(@RequestBody QuestionPaper questionPaper) {
		questionPaper.setStatus("Complete");
		return repository.save(questionPaper).getId();
	}
	
	@GetMapping("/questionpapers/{id}")
	QuestionPaper getQuestionPaper(@PathVariable Integer id) {
		QuestionPaper oldQuestionPaper = null;
		try {
			oldQuestionPaper = repository.findById(id).get();
		} catch (NoSuchElementException ex) {
			
		}
		
		return oldQuestionPaper;
	}
	
	@PutMapping("/questionpapers/{id}")
	Integer updateQuestionPaper(@RequestBody QuestionPaper newQuestionPaper, @PathVariable Integer id) {
		
		QuestionPaper oldQuestionPaper = null;
		try {
			oldQuestionPaper = repository.findById(id).get();
		} catch (NoSuchElementException ex) {
			newQuestionPaper.setId(id);
			return repository.save(newQuestionPaper).getId();
		}
		
		oldQuestionPaper.setClassName(newQuestionPaper.getClassName());
		oldQuestionPaper.setDuration(newQuestionPaper.getDuration());
		oldQuestionPaper.setEvaluationType(newQuestionPaper.getEvaluationType());
		oldQuestionPaper.setFullMarks(newQuestionPaper.getFullMarks());
		oldQuestionPaper.setNumberOfQuestions(newQuestionPaper.getNumberOfQuestions());
		oldQuestionPaper.setPassMarks(newQuestionPaper.getPassMarks());
		oldQuestionPaper.setSection(newQuestionPaper.getSection());
		oldQuestionPaper.setStatus("Complete");
		
		return repository.save(oldQuestionPaper).getId();
		
	}

}
