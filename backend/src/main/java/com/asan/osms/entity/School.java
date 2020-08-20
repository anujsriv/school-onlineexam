package com.asan.osms.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "OSMS_SCHOOL_TENANTID")
public class School {
	
	@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
	
	@Column(name = "SCHOOL_NAME")
	private String schoolName;
	
	@Column(name = "TENANT_ID")
	private String tenantID;
	
	@Column(name = "VIDEO_APP_ID")
	private String videoAppID;
	

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
	 * @return the schoolName
	 */
	public String getSchoolName() {
		return schoolName;
	}

	/**
	 * @param schoolName the schoolName to set
	 */
	public void setSchoolName(String schoolName) {
		this.schoolName = schoolName;
	}

	/**
	 * @return the tenantID
	 */
	public String getTenantID() {
		return tenantID;
	}

	/**
	 * @param tenantID the tenantID to set
	 */
	public void setTenantID(String tenantID) {
		this.tenantID = tenantID;
	}

	/**
	 * @return the videoAppID
	 */
	public String getVideoAppID() {
		return videoAppID;
	}

	/**
	 * @param videoAppID the videoAppID to set
	 */
	public void setVideoAppID(String videoAppID) {
		this.videoAppID = videoAppID;
	}

}
