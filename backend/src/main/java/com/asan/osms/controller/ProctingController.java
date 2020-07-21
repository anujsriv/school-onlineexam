package com.asan.osms.controller;

import java.net.URLEncoder;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asan.osms.bo.GenerateVidyoIOTokenBO;
import com.asan.osms.entity.Procting;
import com.asan.osms.exception.ResourceNotFoundException;
import com.asan.osms.repository.ProctingRepository;

@RestController
@RequestMapping("/api")
public class ProctingController {

	private final ProctingRepository repository;
	private final GenerateVidyoIOTokenBO generateVidyoIOTokenBO;

	ProctingController(ProctingRepository proctingRepository, GenerateVidyoIOTokenBO generateVidyoIOTokenBO) {
		this.repository = proctingRepository;
		this.generateVidyoIOTokenBO = generateVidyoIOTokenBO;
	}

	@PostMapping("/procting")
	void saveProcting(@RequestBody Procting procting) {
		
		try {
			String scheme = "http://139.59.7.122:8080/proctor/proctor.html?";
			String key = "9b1e20e3c88a44e2b827db0c2f3ee0d2";
			String userName = procting.getUserName();
			String appID = "6da13d.vidyo.io";
			String expires = "600";
			String vCard = "";

			String accessToken = generateVidyoIOTokenBO.generateProvisionToken(key, userName + "@" + appID, expires, vCard);
			String encodedToken = URLEncoder.encode(accessToken, "UTF-8");

			String URI = "host=prod.vidyo.io&resourceId=" + procting.getClassName() + procting.getSection() + "&token="
					+ encodedToken + "&displayName=" + procting.getUserName() + "&autoJoin=1";

			String videoURL = scheme+URI;
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

}
