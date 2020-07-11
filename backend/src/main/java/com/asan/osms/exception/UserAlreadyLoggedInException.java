package com.asan.osms.exception;

public class UserAlreadyLoggedInException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public UserAlreadyLoggedInException(String name) {
		super(String.format("User %s already logged in. Please close the previous session to login again.", name));
	}

}
