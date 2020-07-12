package com.asan.osms.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "OSMS_QUESTION")
public class Question {
	
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
	
	@Column(name = "QUESTION_PAPER_ID")
	private Integer questionPaperID;
	
	@Column(name = "TYPE")
	private String type;
	
	@Column(name = "QUESTION")
	private String question;
	
	@Column(name = "MARKS")
	private String marks;
	
	@Column(name = "OPTIONS")
	private String options;
	
	@Column(name = "RIGHT_ANSWERS")
	private String rightAnswers;
	
	@Column(name = "IMAGE_PATH")
	private String imagePath;

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
	 * @return the type
	 */
	public String getType() {
		return type;
	}

	/**
	 * @param type the type to set
	 */
	public void setType(String type) {
		this.type = type;
	}

	/**
	 * @return the question
	 */
	public String getQuestion() {
		return question;
	}

	/**
	 * @param question the question to set
	 */
	public void setQuestion(String question) {
		this.question = question;
	}

	/**
	 * @return the marks
	 */
	public String getMarks() {
		return marks;
	}

	/**
	 * @param marks the marks to set
	 */
	public void setMarks(String marks) {
		this.marks = marks;
	}

	/**
	 * @return the options
	 */
	public String getOptions() {
		return options;
	}

	/**
	 * @param options the options to set
	 */
	public void setOptions(String options) {
		this.options = options;
	}

	/**
	 * @return the rightAnswers
	 */
	public String getRightAnswers() {
		return rightAnswers;
	}

	/**
	 * @param rightAnswers the rightAnswers to set
	 */
	public void setRightAnswers(String rightAnswers) {
		this.rightAnswers = rightAnswers;
	}

	/**
	 * @return the imagePath
	 */
	public String getImagePath() {
		return imagePath;
	}

	/**
	 * @param imagePath the imagePath to set
	 */
	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}

}
