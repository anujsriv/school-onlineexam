package com.asan.osms.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.asan.osms.entity.AnswerPaper;

public interface AnswerPaperRepository extends CrudRepository<AnswerPaper, Integer> {
	
	@Query(value = "SELECT ap FROM AnswerPaper ap WHERE ap.questionPaperID = ?1 AND ap.studentID = ?2")
	AnswerPaper findByQuestionPaperAndStudent(Integer questionPaperID, Integer studentID);

}
