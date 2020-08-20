package com.asan.osms.bo;

import org.springframework.stereotype.Component;

import com.asan.osms.beans.TranslateRequest;
import com.google.cloud.translate.Translate;
import com.google.cloud.translate.Translate.TranslateOption;
import com.google.cloud.translate.TranslateOptions;
import com.google.cloud.translate.Translation;

@Component
public class GoogleTranslationBO {

	public String translateTextGCAPI(TranslateRequest translateRequest) {

		Translate translate = TranslateOptions.getDefaultInstance().getService();

		String textToTranslate = translateRequest.getQ();
		String sourceLanguage = translateRequest.getSource();
		String targetLanguage = translateRequest.getTarget();
		String format = translateRequest.getFormat();

		Translation translation = translate.translate(textToTranslate, TranslateOption.format(format),
				TranslateOption.sourceLanguage(sourceLanguage),
				TranslateOption.targetLanguage(targetLanguage));

		if (translation.getTranslatedText() != null && !translation.getTranslatedText().isEmpty()) {
			return translation.getTranslatedText();
		}

		return null;
	}

}
