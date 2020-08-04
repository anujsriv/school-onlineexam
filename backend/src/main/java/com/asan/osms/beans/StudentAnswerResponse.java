package com.asan.osms.beans;

import java.util.List;

public class StudentAnswerResponse {
	
	private Integer id;
	private String subject;
	private Double fullMarks;
	private Double passMarks;
	private Double totalMarksObtained;
	private String result;
	private List<QuestionAndAnswer> qas;
	
	
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
	 * @return the totalMarksObtained
	 */
	public Double getTotalMarksObtained() {
		return totalMarksObtained;
	}
	/**
	 * @param totalMarksObtained the totalMarksObtained to set
	 */
	public void setTotalMarksObtained(Double totalMarksObtained) {
		this.totalMarksObtained = totalMarksObtained;
	}
	/**
	 * @return the result
	 */
	public String getResult() {
		return result;
	}
	/**
	 * @param result the result to set
	 */
	public void setResult(String result) {
		this.result = result;
	}
	/**
	 * @return the qas
	 */
	public List<QuestionAndAnswer> getQas() {
		return qas;
	}
	/**
	 * @param qas the qas to set
	 */
	public void setQas(List<QuestionAndAnswer> qas) {
		this.qas = qas;
	}

}
