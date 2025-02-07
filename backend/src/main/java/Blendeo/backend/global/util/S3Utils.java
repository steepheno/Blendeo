package Blendeo.backend.global.util;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.util.IOUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;

@Component
@Slf4j
@RequiredArgsConstructor
public class S3Utils {

    private final AmazonS3 s3;
    @Value("${aws.s3.bucket}")
    private String bucket;

    public void uploadToS3(File file, String fileName, String contentType) {
        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(contentType);
            metadata.setContentLength(file.length());

            PutObjectRequest putObjectRequest = new PutObjectRequest(
                    bucket,
                    fileName,
                    new FileInputStream(file),
                    metadata
            );

            s3.putObject(putObjectRequest);
        } catch (IOException e) {
            log.error("Error uploading file to S3", e);
            throw new RuntimeException("Failed to upload file to S3", e);
        }
    }

    public String getUrlByFileName(String fileName) {
        return s3.getUrl(bucket, fileName).toString();
    }

    /**
     * S3에서 File 추출 (* 필요에 의해 tempFile cleanUp 하는 코드 삭제. 사용할 때마다 tempFile 제거해줘야함!)
     * @param s3Url
     * @return
     */
    public File extractFileFromS3(String s3Url) {
        File tempFile = null;
        try {
            // S3 URL에서 객체 키 추출
            String objectKey = extractObjectKeyFromUrl(s3Url);

            // 임시 파일 생성
            tempFile = File.createTempFile("video_", ".mp4");

            // S3에서 파일 다운로드
            S3Object s3Object = s3.getObject(bucket, objectKey);
            try (InputStream inputStream = s3Object.getObjectContent();
                 FileOutputStream outputStream = new FileOutputStream(tempFile)) {

                IOUtils.copy(inputStream, outputStream);
            }

            return tempFile;
        } catch (IOException e) {
            throw new RuntimeException("Failed to process video file from S3: " + e.getMessage(), e);
        }
    }

    private String extractObjectKeyFromUrl(String s3Url) {
        try {
            URL url = new URL(s3Url);
            String path = url.getPath();
            log.info("Path: " + path +" ObjectKey: " + path.substring(1));
            // 버킷 이름 이후의 경로를 객체 키로 사용
            return path.substring(1);
        } catch (MalformedURLException e) {
            throw new IllegalArgumentException("Invalid S3 URL: " + s3Url, e);
        }
    }

    // URL로 삭제하고 싶은 경우 아래 메서드도 추가
    public void deleteFromS3ByUrl(String s3Url) {
        try {
            String objectKey = extractObjectKeyFromUrl(s3Url);
            s3.deleteObject(bucket, objectKey);
            log.info("Successfully deleted file {} from S3 bucket {}", objectKey, bucket);
        } catch (Exception e) {
            log.error("Error deleting file from S3", e);
            throw new RuntimeException("Failed to delete file from S3", e);
        }
    }
}
