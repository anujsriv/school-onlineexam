package com.asan.osms.exception;

public class UserAlreadyLoggedOutException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public UserAlreadyLoggedOutException(String name) {
		super(String.format("User %s already logged out..", name));
	}

}
