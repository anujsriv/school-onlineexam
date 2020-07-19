package com.asan.osms.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "OSMS_QUESTION_PAPER")
public class QuestionPaper {
	
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
	
	@Column(name = "CREATED_BY")
	private Integer teacherID;
	
	@Column(name = "SUBJECT")
	private String subject;
	
	@Column(name = "CLASS")
	private String className;
	
	@Column(name = "SECTION")
	private String section;
	
	@Column(name = "NUMBER_OF_QUESTIONS")
	private Integer numberOfQuestions;
	
	@Column(name = "FULL_MARKS")
	private Double fullMarks;
	
	@Column(name = "PASS_MARKS")
	private Double passMarks;
	
	@Column(name = "DURATION")
	private Integer duration;
	
	@Column(name = "EVALUATION_TYPE")
	private String evaluationType;
	
	@Column(name = "INSTRUCTIONS", columnDefinition = "ntext")
	private String instructions;
	
	@Column(name = "STATUS")
	private String status;
	
	@Column(name = "LANGUAGE")
	private String language;

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
	 * @return the teacherID
	 */
	public Integer getTeacherID() {
		return teacherID;
	}

	/**
	 * @param teacherID the teacherID to set
	 */
	public void setTeacherID(Integer teacherID) {
		this.teacherID = teacherID;
	}

	/**
	 * @return the subject
	 */
	public String getSubject() {
		return subject;
	}

	/**
	 * @param subject the subject to set
	 */
	public void setSubject(String subject) {
		this.subject = subject;
	}

	/**
	 * @return the className
	 */
	public String getClassName() {
		return className;
	}

	/**
	 * @param className the className to set
	 */
	public void setClassName(String className) {
		this.className = className;
	}

	/**
	 * @return the section
	 */
	public String getSection() {
		return section;
	}

	/**
	 * @param section the section to set
	 */
	public void setSection(String section) {
		this.section = section;
	}

	/**
	 * @return the numberOfQuestions
	 */
	public Integer getNumberOfQuestions() {
		return numberOfQuestions;
	}

	/**
	 * @param numberOfQuestions the numberOfQuestions to set
	 */
	public void setNumberOfQuestions(Integer numberOfQuestions) {
		this.numberOfQuestions = numberOfQuestions;
	}

	/**
	 * @return the fullMarks
	 */
	public Double getFullMarks() {
		return fullMarks;
	}

	/**
	 * @param fullMarks the fullMarks to set
	 */
	public void setFullMarks(Double fullMarks) {
		this.fullMarks = fullMarks;
	}

	/**
	 * @return the passMarks
	 */
	public Double getPassMarks() {
		return passMarks;
	}

	/**
	 * @param passMarks the passMarks to set
	 */
	public void setPassMarks(Double passMarks) {
		this.passMarks = passMarks;
	}

	/**
	 * @return the duration
	 */
	public Integer getDuration() {
		return duration;
	}

	/**
	 * @param duration the duration to set
	 */
	public void setDuration(Integer duration) {
		this.duration = duration;
	}

	/**
	 * @return the evaluationType
	 */
	public String getEvaluationType() {
		return evaluationType;
	}

	/**
	 * @param evaluationType the evaluationType to set
	 */
	public void setEvaluationType(String evaluationType) {
		this.evaluationType = evaluationType;
	}

	/**
	 * @return the instructions
	 */
	public String getInstructions() {
		return instructions;
	}

	/**
	 * @param instructions the instructions to set
	 */
	public void setInstructions(String instructions) {
		this.instructions = instructions;
	}

	/**
	 * @return the status
	 */
	public String getStatus() {
		return status;
	}

	/**
	 * @param status the status to set
	 */
	public void setStatus(String status) {
		this.status = status;
	}

	/**
	 * @return the language
	 */
	public String getLanguage() {
		return language;
	}

	/**
	 * @param language the language to set
	 */
	public void setLanguage(String language) {
		this.language = language;
	}
	
}
