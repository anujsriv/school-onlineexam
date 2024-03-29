package com.asan.osms.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.asan.osms.entity.QuestionPaper;

public interface QuestionPaperRepository extends CrudRepository<QuestionPaper, Integer> {
	
	@Query(value = "SELECT qp FROM QuestionPaper qp WHERE qp.teacherID = ?1 order by qp.id desc")
	List<QuestionPaper> findAllQuestionPaperForATeacher(Integer teacherID);

	@Query(value = "SELECT qp FROM QuestionPaper qp WHERE qp.className = ?1 and qp.section = ?2 and qp.status = 'Started' order by qp.id desc")
	List<QuestionPaper> findAllQuestionPaperForAClass(String className, String section);
}
