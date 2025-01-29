package Blendeo.backend.global.util;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

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
}
