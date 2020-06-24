package com.asan.osms.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.asan.osms.entity.Question;

public interface QuestionRepository extends PagingAndSortingRepository<Question, Integer> {
	
	@Query(value = "SELECT q FROM Question q WHERE q.questionPaperID = ?1")
	List<Question> getAllQuestionsForQuestionPaper(Integer id);
	
	@Query(value = "SELECT q FROM Question q WHERE q.questionPaperID = ?1")
	Page<Question> getQuestionByQuestionPaperId(Integer id, Pageable pageable);
}
