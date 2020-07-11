package com.asan.osms.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class RestControllerAdvice {

	@ResponseBody
	@ExceptionHandler(ResourceNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	String employeeNotFoundHandler(ResourceNotFoundException ex) {
		return ex.getMessage();
	}
	
	@ResponseBody
	@ExceptionHandler(UserAlreadyLoggedInException.class)
	@ResponseStatus(HttpStatus.FORBIDDEN)
	String userLoggedInHandler(UserAlreadyLoggedInException ex) {
		return ex.getMessage();
	}
	
	@ResponseBody
	@ExceptionHandler(UserAlreadyLoggedOutException.class)
	@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
	String userLoggedOutHandler(UserAlreadyLoggedOutException ex) {
		return ex.getMessage();
	}
}
