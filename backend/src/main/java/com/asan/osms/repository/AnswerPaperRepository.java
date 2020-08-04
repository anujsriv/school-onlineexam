package com.asan.osms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.asan.osms.entity.AnswerPaper;

public interface AnswerPaperRepository extends CrudRepository<AnswerPaper, Integer> {
	
	@Query(value = "SELECT ap FROM AnswerPaper ap WHERE ap.questionPaperID = ?1 AND ap.studentID = ?2 ")
	AnswerPaper findByQuestionPaperAndStudent(Integer questionPaperID, Integer studentID);

	@Query(value = "SELECT ap FROM AnswerPaper ap WHERE ap.questionPaperID = ?1")
	List<AnswerPaper> findByQuestionPaper(Integer questionPaperID);

	@Query(value = "SELECT ap FROM AnswerPaper ap WHERE ap.studentID = ?1 AND ap.status != 'Submitted' ")
	List<AnswerPaper> findByStudent(Integer studentID);

}
