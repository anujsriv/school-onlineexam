package com.asan.osms.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asan.osms.beans.TranslateRequest;
import com.asan.osms.bo.TranslationBO;

@RestController
@RequestMapping("/api")
public class TranslationController {

	private final TranslationBO translationBO;

	TranslationController(TranslationBO translationBO) {
		this.translationBO = translationBO;
	}

	@PostMapping("/translate")
	String translateTextGCAPI(@RequestBody TranslateRequest translateRequest) {
		String translatedText = null;
		try {
			translatedText = translationBO.translateTextGCAPI(translateRequest);
		} catch (Exception ex) {
			ex.printStackTrace();
		}

		return translatedText;
	}

}
