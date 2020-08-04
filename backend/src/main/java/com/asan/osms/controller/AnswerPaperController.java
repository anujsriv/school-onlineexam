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

import com.asan.osms.beans.QuestionAndAnswer;
import com.asan.osms.beans.StudentAnswerResponse;
import com.asan.osms.entity.Answer;
import com.asan.osms.entity.AnswerPaper;
import com.asan.osms.entity.Question;
import com.asan.osms.entity.QuestionPaper;
import com.asan.osms.entity.User;
import com.asan.osms.exception.ResourceNotFoundException;
import com.asan.osms.repository.AnswerPaperRepository;
import com.asan.osms.repository.AnswerRepository;
import com.asan.osms.repository.QuestionPaperRepository;
import com.asan.osms.repository.QuestionRepository;
import com.asan.osms.repository.UserRepository;

@RestController
@RequestMapping("/api")
public class AnswerPaperController {

	private AnswerPaperRepository repository;
	private UserRepository userRepository;
	private QuestionPaperRepository questionPaperRepository;
	private QuestionRepository questionRepository;
	private AnswerRepository answerRepository;

	AnswerPaperController(AnswerPaperRepository answerPaperRepository, UserRepository userRepository,
			QuestionPaperRepository questionPaperRepository, QuestionRepository questionRepository,
			AnswerRepository answerRepository) {
		this.repository = answerPaperRepository;
		this.userRepository = userRepository;
		this.questionPaperRepository = questionPaperRepository;
		this.questionRepository = questionRepository;
		this.answerRepository = answerRepository;
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
	List<StudentAnswerResponse> getAnswerPapersForAStudent(@PathVariable Integer studentID) {
		List<StudentAnswerResponse> answerResponses = null;
		List<AnswerPaper> answerPapers = null;

		try {
			answerPapers = repository.findByStudent(studentID);

			if (answerPapers != null) {
				answerResponses = new ArrayList<StudentAnswerResponse>();
				for (AnswerPaper answerPaper : answerPapers) {
					
					StudentAnswerResponse studentAnswerResponse = new StudentAnswerResponse();
					List<QuestionAndAnswer> qas = null;
					Integer questionPaperID = answerPaper.getQuestionPaperID();
					Integer answerPaperID = answerPaper.getId();
					studentAnswerResponse.setId(answerPaperID);
					
					QuestionPaper questionPaper = questionPaperRepository.findById(questionPaperID)
							.get();
					if (questionPaper != null) {
						
						Double totalMarksObtained = 0.0;
						String result = "pass";

						List<Question> questions = questionRepository.getAllQuestionsForQuestionPaper(questionPaperID);
						List<Answer> answers = answerRepository.findByAnswerPaper(answerPaperID);
						
						if (questions != null && !questions.isEmpty()) {
							qas = new ArrayList<QuestionAndAnswer>();
							for (Question question : questions) {
								QuestionAndAnswer questionAndAnswer = new QuestionAndAnswer();
								questionAndAnswer.setQuestion(question.getQuestion());
								questionAndAnswer.setFullMarks(Double.valueOf(question.getMarks()));
								
								if (answers != null && !answers.isEmpty()) {
									
									for (Answer answer : answers) {
										
										if (question.getId().equals(answer.getQuestionID())) {
											questionAndAnswer.setAnswer(answer.getAnswer());
											questionAndAnswer.setCorrectIncorrect(answer.getCorrectIncorrect());
											questionAndAnswer.setMarksObtained(answer.getMarksObtained());
											questionAndAnswer.setId(answer.getId());
											
											totalMarksObtained = totalMarksObtained + answer.getMarksObtained();
										}
									}
								}
								qas.add(questionAndAnswer);
							}
						}

						studentAnswerResponse.setQas(qas);
						studentAnswerResponse.setFullMarks(questionPaper.getFullMarks());
						studentAnswerResponse.setPassMarks(questionPaper.getPassMarks());
						studentAnswerResponse.setSubject(questionPaper.getSubject());
						studentAnswerResponse.setTotalMarksObtained(totalMarksObtained);
						
						if (totalMarksObtained <= questionPaper.getPassMarks()) {
							result = "fail";
						}
						studentAnswerResponse.setResult(result);
					}
					
					answerResponses.add(studentAnswerResponse);
				}
				return answerResponses;
			}
		} catch (NoSuchElementException ex) {
			throw new ResourceNotFoundException(String.valueOf(studentID));
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
