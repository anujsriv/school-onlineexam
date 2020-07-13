package com.asan.osms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.asan.osms.entity.Answer;

public interface AnswerRepository extends CrudRepository<Answer, Integer> {
	
	@Query(value = "SELECT a FROM Answer a WHERE a.answerPaperID = ?1 AND a.questionID = ?2")
	Answer findByAnswerPaperAndQuestion(Integer answerPaperID, Integer questionID);

	@Query(value = "SELECT a FROM Answer a WHERE a.answerPaperID = ?1")
	List<Answer> findByAnswerPaper(Integer answerPaperID);
}
