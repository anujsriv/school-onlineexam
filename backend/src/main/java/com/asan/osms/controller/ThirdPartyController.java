package com.asan.osms.controller;

import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.asan.osms.beans.TranslateRequest;
import com.asan.osms.bo.AmazonS3BO;
import com.asan.osms.bo.GenerateVidyoIOTokenBO;
import com.asan.osms.bo.GoogleTranslationBO;
import com.asan.osms.entity.Procting;
import com.asan.osms.exception.ResourceNotFoundException;
import com.asan.osms.multitenancy.TenantContext;
import com.asan.osms.repository.ProctingRepository;

@RestController
@RequestMapping("/api")
public class ThirdPartyController {

	private final GoogleTranslationBO translationBO;
	private final ProctingRepository repository;
	private final AmazonS3BO amazonS3BO;
	private final GenerateVidyoIOTokenBO generateVidyoIOTokenBO;

	ThirdPartyController(GoogleTranslationBO translationBO, ProctingRepository proctingRepository, AmazonS3BO amazonS3BO, GenerateVidyoIOTokenBO generateVidyoIOTokenBO) {
		this.translationBO = translationBO;
		this.repository = proctingRepository;
		this.amazonS3BO = amazonS3BO;
		this.generateVidyoIOTokenBO = generateVidyoIOTokenBO;
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

	@PostMapping("/procting")
	void saveProcting(@RequestBody Procting procting) {

		try {
			String scheme = "https://prarat-oems.com/proctor/proctor.html?";
			String key = "9b1e20e3c88a44e2b827db0c2f3ee0d2";
			String userName = procting.getUserName();
			String appID = "6da13d.vidyo.io";
			String expires = "600";
			String vCard = "";

			String accessToken = generateVidyoIOTokenBO.generateProvisionToken(key, userName + "@" + appID, expires, vCard);
			String encodedToken = URLEncoder.encode(accessToken, "UTF-8");

			String URI = "host=prod.vidyo.io&resourceId=" + procting.getClassName() + procting.getSection() + "&token="
					+ encodedToken + "&displayName=" + procting.getUserName() + "&autoJoin=1";

			String videoURL = scheme + URI;
			procting.setVideoURL(videoURL);
		} catch (Exception ex) {

		}

		repository.save(procting);
	}

	@GetMapping("/procting/{userName}")
	Procting getUserByUserName(@PathVariable String userName) {
		Procting procting = null;
		try {
			procting = repository.findByUserName(userName);
		} catch (NoSuchElementException ex) {
			throw new ResourceNotFoundException(String.valueOf(userName));
		}

		if (procting != null) {
			return procting;
		}

		throw new ResourceNotFoundException(String.valueOf(userName));
	}

	@DeleteMapping("/procting/{className}/{section}")
	void deletePRoctingURLByClassNameAndSection(@PathVariable String className, @PathVariable String section) {
		List<Procting> proctingList = null;
		try {
			proctingList = repository.findByClassNameAndSection(className, section);
		} catch (NoSuchElementException ex) {
			throw new ResourceNotFoundException(String.valueOf(className));
		}

		if (proctingList != null) {
			repository.deleteAll(proctingList);
		}

		throw new ResourceNotFoundException(String.valueOf(className));
	}

	@PostMapping("/upload")
	String uploadQuestionPaper(@RequestParam("file") MultipartFile file, @RequestParam("docType") String docType, @RequestParam("userName") String userName, @RequestParam("fileName") String fileName) {
		String tagInfo = null;
		String bucketName = null;
		String objectKey = null;

		try {
			String tenanId = TenantContext.getCurrentTenant();
			
			String tempPath = System.getProperty("java.io.tmpdir");
			objectKey = "oems/" + tenanId + "/" + userName + "/"	+ fileName;
			String objectPath = tempPath + "/" + fileName;
			Path targetLocation = Paths.get(objectPath);
			
			//Copy to a temp location and then PUT to S3 bucket.
			Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
			

			List<String> buckets = amazonS3BO.getAllBuckets();
			if (buckets != null && !buckets.isEmpty()) {
				bucketName = buckets.get(0);
			}

			tagInfo = amazonS3BO.putS3Object(bucketName, objectKey, objectPath);

		} catch (Exception ex) {
			ex.printStackTrace();
		}

		return bucketName+"~"+objectKey+"~"+tagInfo;
	}
}
