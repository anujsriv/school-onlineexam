package com.asan.osms.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "OSMS_ANSWER_PAPER")
public class AnswerPaper {
	
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
	
	@Column(name = "QUESTION_PAPER_ID")
	private Integer questionPaperID;
	
	@Column(name = "STUDENT_ID")
	private Integer studentID;

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
	 * @return the questionPaperID
	 */
	public Integer getQuestionPaperID() {
		return questionPaperID;
	}

	/**
	 * @param questionPaperID the questionPaperID to set
	 */
	public void setQuestionPaperID(Integer questionPaperID) {
		this.questionPaperID = questionPaperID;
	}

	/**
	 * @return the studentID
	 */
	public Integer getStudentID() {
		return studentID;
	}

	/**
	 * @param studentID the studentID to set
	 */
	public void setStudentID(Integer studentID) {
		this.studentID = studentID;
	}

}
