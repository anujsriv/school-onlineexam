package com.asan.osms.bo;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

import org.springframework.stereotype.Component;

import software.amazon.awssdk.core.exception.SdkServiceException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.ListBucketsRequest;
import software.amazon.awssdk.services.s3.model.ListBucketsResponse;
import software.amazon.awssdk.services.s3.model.ListObjectsRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import software.amazon.awssdk.services.s3.model.S3Object;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

@Component
public class AmazonS3BO {

	private S3Client s3Client = null;

	public List<String> getAllBuckets() {
		try {
			s3Client = S3Client.builder().region(Region.AP_SOUTH_1).build();
			List<String> bucketNames = new ArrayList<String>();

			ListBucketsRequest listBucketsRequest = ListBucketsRequest.builder().build();
			ListBucketsResponse listBucketsResponse = s3Client.listBuckets(listBucketsRequest);
			listBucketsResponse.buckets().stream().forEach(x -> {
				if (!bucketNames.contains(x.name())) {
					bucketNames.add(x.name());
				}
			});

			s3Client.close();
			return bucketNames;
		} catch (SdkServiceException awsSdkEx) {
			awsSdkEx.printStackTrace();
		}

		finally {
			s3Client.close();
		}

		return null;
	}

	public String putS3Object(String bucketName, String objectKey, String objectPath) {

		try {
			s3Client = S3Client.builder().region(Region.AP_SOUTH_1).build();

			PutObjectResponse response = s3Client.putObject(
					PutObjectRequest.builder().bucket(bucketName).key(objectKey).build(),
					RequestBody.fromBytes(getObjectFile(objectPath)));

			return response.eTag();
		} catch (SdkServiceException | FileNotFoundException e) {
			e.printStackTrace();
			s3Client.close();
		}

		finally {
			s3Client.close();
		}
		return "";
	}

	private byte[] getObjectFile(String path) throws FileNotFoundException {

		byte[] bFile = readBytesFromFile(path);
		return bFile;
	}

	private byte[] readBytesFromFile(String filePath) {

		FileInputStream fileInputStream = null;
		byte[] bytesArray = null;

		try {
			File file = new File(filePath);
			bytesArray = new byte[(int) file.length()];

			// read file into bytes[]
			fileInputStream = new FileInputStream(file);
			fileInputStream.read(bytesArray);

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (fileInputStream != null) {
				try {
					fileInputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return bytesArray;
	}

	public void listBucketObjects(String bucketName) {

		try {
			s3Client = S3Client.builder().region(Region.AP_SOUTH_1).build();

			ListObjectsRequest listObjects = ListObjectsRequest.builder().bucket(bucketName).build();

			ListObjectsResponse res = s3Client.listObjects(listObjects);
			List<S3Object> objects = res.contents();

			for (ListIterator<S3Object> iterVals = objects.listIterator(); iterVals.hasNext();) {
				S3Object myValue = iterVals.next();
				System.out.print("\n The name of the key is " + myValue.key());
				System.out.print("\n The object is " + calKb(myValue.size()) + " KBs");
				System.out.print("\n The owner is " + myValue.owner());
			}
		} catch (SdkServiceException e) {
			e.printStackTrace();
			s3Client.close();
		}

		finally {
			s3Client.close();
		}
	}

	private static long calKb(Long val) {
		return val / 1024;
	}

	public String getPresignedUrl(String bucketName, String keyName) {
		S3Presigner presigner = null;
		PresignedGetObjectRequest presignedGetObjectRequest = null;
		try {
			presigner = S3Presigner.builder().region(Region.AP_SOUTH_1).build();

			// Create a GetObjectRequest to be pre-signed
			GetObjectRequest getObjectRequest = GetObjectRequest.builder().bucket(bucketName).key(keyName).build();

			// Create a GetObjectPresignRequest to specify the signature duration
			GetObjectPresignRequest getObjectPresignRequest = GetObjectPresignRequest.builder()
					.signatureDuration(Duration.ofDays(1)).getObjectRequest(getObjectRequest).build();

			// Generate the presigned request
			presignedGetObjectRequest = presigner.presignGetObject(getObjectPresignRequest);

		} catch (SdkServiceException e) {
			e.printStackTrace();
			if (presigner != null) {
				presigner.close();
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			if (presigner != null) {
				presigner.close();
			}
		}
		
		finally {
			if (presigner != null) {
				presigner.close();
			} 
		}

		return presignedGetObjectRequest.url().toString();
	}

	public static void main(String args[]) {

		AmazonS3BO amazonS3BO = new AmazonS3BO();
		List<String> buckets = amazonS3BO.getAllBuckets();

		String bucketName = buckets.get(0);
		String objectKey = "oems/oems_kvb/" + "Questions.JPG";
		String objectPath = "C:\\images\\Capture2.JPG";

		String result = amazonS3BO.putS3Object(bucketName, objectKey, objectPath);
		System.out.println("Path : " + objectKey);
		System.out.println("Tag information: " + result);
	}
}
