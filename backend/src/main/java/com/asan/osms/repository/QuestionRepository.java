package com.asan.osms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.asan.osms.entity.Question;

public interface QuestionRepository extends CrudRepository<Question, Integer> {
	
	@Query(value = "SELECT q FROM Question q WHERE q.questionPaperID = ?1")
	List<Question> getAllQuestionsForQuestionPaper(Integer id);
}
