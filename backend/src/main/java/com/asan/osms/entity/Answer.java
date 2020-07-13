package com.asan.osms.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "OSMS_ANSWER")
public class Answer {
	
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
	
	@Column(name = "ANSWER_PAPER_ID")
	private Integer answerPaperID;
	
	@Column(name = "QUESTION_ID")
	private Integer questionID;
	
	@Column(name = "ANSWER", columnDefinition = "ntext")
	private String answer;

	/**
	 * @return the id
	 */
	public Integer getId() {
		return id;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(Integer id) {
		this.id = id;
	}

	/**
	 * @return the answerPaperID
	 */
	public Integer getAnswerPaperID() {
		return answerPaperID;
	}

	/**
	 * @param answerPaperID the answerPaperID to set
	 */
	public void setAnswerPaperID(Integer answerPaperID) {
		this.answerPaperID = answerPaperID;
	}

	/**
	 * @return the questionID
	 */
	public Integer getQuestionID() {
		return questionID;
	}

	/**
	 * @param questionID the questionID to set
	 */
	public void setQuestionID(Integer questionID) {
		this.questionID = questionID;
	}

	/**
	 * @return the answer
	 */
	public String getAnswer() {
		return answer;
	}

	/**
	 * @param answer the answer to set
	 */
	public void setAnswer(String answer) {
		this.answer = answer;
	}

}
