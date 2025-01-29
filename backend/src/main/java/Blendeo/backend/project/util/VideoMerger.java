package Blendeo.backend.project.util;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class VideoMerger {

        private final AmazonS3 s3;
        @Value("${aws.s3.bucket}")
        private String bucket;
        @Value("${ffmpeg.path}")
        private String ffmpegPath;
        @Value("${video.output.path}")
        private String outputPath;
        @Value("${aws.s3.dir}")
        private String directory;
        @Value("${ffprobe.path}")
        public String ffprobePath;

        public String mergeVideos(MultipartFile video1, MultipartFile video2) {
        String mergedVideoUrl  = null;
        File tempVideo1 = null;
        File tempVideo2 = null;
        File mergedVideo = null;
        try {
            // 임시 파일 생성
            tempVideo1 = File.createTempFile("video1_", ".mp4");
            tempVideo2 = File.createTempFile("video2_", ".mp4");

            // MultipartFile을 임시 파일로 저장
            video1.transferTo(tempVideo1);
            video2.transferTo(tempVideo2);

            VideoInfo videoInfo = new VideoInfo(tempVideo1.getPath(), ffprobePath);
            String mergedVideoPath = null;

            System.out.println(videoInfo.getWidth() +" " + videoInfo.getHeight());
            if (videoInfo.getWidth() > videoInfo.getHeight()) { // 너비가 더 길다
                // 비디오 합치기 실행
                mergedVideoPath = mergeVideosVertically(
                        tempVideo1.getAbsolutePath(),
                        tempVideo2.getAbsolutePath()
                );
            } else {
                mergedVideoPath = mergeVideosHorizontally(
                        tempVideo1.getAbsolutePath(),
                        tempVideo2.getAbsolutePath()
                );
            }
            // 병합된 비디오 파일 생성
            mergedVideo = new File(mergedVideoPath);

            // S3에 업로드
            String fileName = directory + "/merged_" + UUID.randomUUID() + ".mp4";
            uploadToS3(mergedVideo, fileName);

            // S3 URL 생성
            mergedVideoUrl = s3.getUrl(bucket, fileName).toString();

        } catch (Exception e) {
            log.error("Error processing video merge request", e);
            throw new RuntimeException("Failed to merge videos", e);
        } finally {
            // 임시 파일 삭제
            cleanupTempFiles(tempVideo1, tempVideo2, mergedVideo);
        }
        return mergedVideoUrl;
    }

    private void cleanupTempFiles(File... files) {
        for (File file : files) {
            if (file != null && file.exists()) {
                file.delete();
            }
        }
    }


    private void uploadToS3(File file, String fileName) {
        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType("video/mp4");
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

    public String mergeVideosHorizontally(String video1Path, String video2Path) {
        try {
            String outputFileName = "merged_" + System.currentTimeMillis() + ".mp4";
            String outputFilePath = outputPath + File.separator + outputFileName;

            // FFmpeg 명령어 구성
            List<String> command = new ArrayList<>();
            command.add(ffmpegPath);
            command.add("-i");
            command.add(video1Path);
            command.add("-i");
            command.add(video2Path);
            command.add("-filter_complex");
            command.add("[0:v][1:v]scale2ref=oh*mdar:ih[v0][v1];[v0][v1]hstack=inputs=2[v]");
            command.add("-map");
            command.add("[v]");
            command.add("-c:v");
            command.add("libx264");
            command.add("-c:a");
            command.add("aac");
            command.add(outputFilePath);

            // ProcessBuilder를 사용하여 FFmpeg 실행
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            // 프로세스 출력 로그 기록
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    log.info(line);
                }
            }

            // 프로세스 완료 대기
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("FFmpeg process failed with exit code: " + exitCode);
            }

            return outputFilePath;

        } catch (IOException | InterruptedException e) {
            log.error("Error merging videos", e);
            throw new RuntimeException("Failed to merge videos", e);
        }
    }


    public String mergeVideosVertically(String video1Path, String video2Path) {
        try {
            String outputFileName = "merged_" + System.currentTimeMillis() + ".mp4";
            String outputFilePath = outputPath + File.separator + outputFileName;

            // FFmpeg 명령어 구성
            List<String> command = new ArrayList<>();
            command.add(ffmpegPath);
            command.add("-i");
            command.add(video1Path);
            command.add("-i");
            command.add(video2Path);
            command.add("-filter_complex");
            command.add("[0:v][1:v]scale2ref=oh*mdar:ih[v0][v1];[v0][v1]vstack=inputs=2[v]");
            command.add("-map");
            command.add("[v]");
            command.add("-c:v");
            command.add("libx264");
            command.add("-c:a");
            command.add("aac");
            command.add(outputFilePath);

            // ProcessBuilder를 사용하여 FFmpeg 실행
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            // 프로세스 출력 로그 기록
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    log.info(line);
                }
            }

            // 프로세스 완료 대기
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("FFmpeg process failed with exit code: " + exitCode);
            }

            return outputFilePath;

        } catch (IOException | InterruptedException e) {
            log.error("Error merging videos", e);
            throw new RuntimeException("Failed to merge videos", e);
        }
    }


}
