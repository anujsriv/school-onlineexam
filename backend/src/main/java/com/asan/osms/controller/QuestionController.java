package com.asan.osms.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.asan.osms.entity.Question;
import com.asan.osms.repository.QuestionRepository;

@RestController
public class QuestionController {
	
	private final QuestionRepository repository;
	
	QuestionController(QuestionRepository questionrepository) {
		this.repository = questionrepository;
	}
	
	@PostMapping("/question")
	Question saveQuestion(@RequestBody Question newQuestion) {
		return repository.save(newQuestion);
	}
	
	@GetMapping("/question/{questionPaperID}")
	List<Question> getAllQuestionsForQuestionPaper(@PathVariable Integer questionPaperID) {
		return repository.getAllQuestionsForQuestionPaper(questionPaperID);
	}
	
	@GetMapping("/question/{questionPaperID}/{pageNumber}")
	Page<Question> getQuestionByQuestionPaperId(@PathVariable Integer questionPaperID,
			@PathVariable Integer pageNumber) {
		Pageable pageable = PageRequest.of(pageNumber, 1, Sort.by("id").ascending());
		return repository.getQuestionByQuestionPaperId(questionPaperID, pageable);
	}
	
	@PutMapping("/question/{id}")
	Integer updateQuestion(@RequestBody Question newQuestion, @PathVariable Integer id) {
		
		Question oldQuestion = null;
		
		try {
			oldQuestion = repository.findById(id).get();
		} catch (NoSuchElementException ex) {
			
		}
		
		oldQuestion.setImagePath(newQuestion.getImagePath());
		oldQuestion.setOptions(newQuestion.getOptions());
		oldQuestion.setQuestion(newQuestion.getQuestion());
		oldQuestion.setQuestionPaperID(newQuestion.getQuestionPaperID());
		oldQuestion.setRightAnswers(newQuestion.getRightAnswers());
		oldQuestion.setType(newQuestion.getType());
		
		return repository.save(oldQuestion).getId();
	}

}
