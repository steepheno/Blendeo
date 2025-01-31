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

    @Value("${ffmpeg.path}")
    private String ffmpegPath;

    public String mergeVideosHorizontally(String video1Path, String video2Path) {
        try {
            String outputFileName = "merged_" + UUID.randomUUID().toString() + ".mp4";
            // System.getProperty("java.io.tmpdir") : 현재 운영체제의 임시 디렉토리 경로 반환.
            String outputFilePath = System.getProperty("java.io.tmpdir") + File.separator + outputFileName;

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
            String outputFileName = "merged_" + UUID.randomUUID().toString() + ".mp4";
            // System.getProperty("java.io.tmpdir") : 현재 운영체제의 임시 디렉토리 경로 반환.
            String outputFilePath = System.getProperty("java.io.tmpdir") + File.separator + outputFileName;

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

    public void cleanupTempFiles(File... files) {
        for (File file : files) {
            if (file != null && file.exists()) {
                file.delete();
            }
        }
    }

}
