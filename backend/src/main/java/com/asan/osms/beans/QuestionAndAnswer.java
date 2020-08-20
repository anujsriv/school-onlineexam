package com.asan.osms.beans;

public class QuestionAndAnswer {
	
	private Integer id;
	private String question;
	private String answer;
	private String correctIncorrect;
	private Integer marksObtained;
	private Double fullMarks;
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
	/**
	 * @return the correctIncorrect
	 */
	public String getCorrectIncorrect() {
		return correctIncorrect;
	}
	/**
	 * @param correctIncorrect the correctIncorrect to set
	 */
	public void setCorrectIncorrect(String correctIncorrect) {
		this.correctIncorrect = correctIncorrect;
	}
	/**
	 * @return the marksObtained
	 */
	public Integer getMarksObtained() {
		return marksObtained;
	}
	/**
	 * @param integer the marksObtained to set
	 */
	public void setMarksObtained(Integer marksObtained) {
		this.marksObtained = marksObtained;
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
