package Blendeo.backend.project.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class VideoMerger {

    private final String ffmpegPath;
    private final String outputPath;

    public VideoMerger(
            @Value("${ffmpeg.path}") String ffmpegPath,
            @Value("${video.output.path}") String outputPath) {
        this.ffmpegPath = ffmpegPath;
        this.outputPath = outputPath;
    }

    public String mergeVideos(MultipartFile video1, MultipartFile video2) {
        String mergedVideoPath = null;
        try {
            // 임시 파일 생성
            File tempVideo1 = File.createTempFile("video1_", ".mp4");
            File tempVideo2 = File.createTempFile("video2_", ".mp4");

            // MultipartFile을 임시 파일로 저장
            video1.transferTo(tempVideo1);
            video2.transferTo(tempVideo2);

            VideoInfo videoInfo = new VideoInfo(tempVideo1.getPath());

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

            // 임시 파일 삭제
            tempVideo1.delete();
            tempVideo2.delete();

        } catch (Exception e) {
            log.error("Error processing video merge request", e);
        }
        return mergedVideoPath;
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
