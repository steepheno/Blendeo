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
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
@RequiredArgsConstructor
public class VideoMerger {

    @Value("${ffmpeg.path}")
    private String ffmpegPath;
//
//    private List<String> buildFFmpegCommand(String video1Path, String video2Path, String outputFilePath, boolean horizontal) {
//        List<String> command = new ArrayList<>();
//        command.add(ffmpegPath);
//
//        // 첫 번째 입력에 대한 하드웨어 가속 설정
//        command.add("-hwaccel");
//        command.add("cuda");
//        command.add("-i");
//        command.add(video1Path);
//
//        // 두 번째 입력에 대한 하드웨어 가속 설정
//        command.add("-hwaccel");
//        command.add("cuda");
//        command.add("-i");
//        command.add(video2Path);
//
//        // 인코딩 성능 최적화 설정
//        command.add("-preset");
//        command.add("p1");
//
//        // 필터 설정
//        command.add("-filter_complex");
//
//        // 비디오 스케일링 및 패딩을 위한 필터 구성
//        StringBuilder filterComplex = new StringBuilder();
//
//        // 수정된 코드
//        if (horizontal) {
//            filterComplex.append("[0:v]scale=679:480:force_original_aspect_ratio=decrease[v0];");
//            filterComplex.append("[1:v]scale=679:480:force_original_aspect_ratio=decrease[v1];");
//        } else {
//            // 세로로 합칠 때 (480:679)
//            filterComplex.append("[0:v]scale=480:679:force_original_aspect_ratio=decrease[v0];");
//            filterComplex.append("[1:v]scale=480:679:force_original_aspect_ratio=decrease[v1];");
//        }
//
//        // 스택 필터 추가
//        String stackFilter = horizontal ? "hstack" : "vstack";
//        filterComplex.append("[v0][v1]").append(stackFilter).append("=inputs=2[v]");
//
//        command.add(filterComplex.toString());
//
//        command.add("-map");
//        command.add("[v]");
//
//        // 출력 인코더 설정
//        command.add("-c:v");
//        command.add("hevc_nvenc");
//
//        // 최적화된 인코딩 설정
//        command.add("-rc:v");
//        command.add("constqp");
//        command.add("-qp");
//        command.add("27");
//
//        command.add("-c:a");
//        command.add("aac");
//
//        command.add(outputFilePath);
//
//        // 디버깅을 위한 전체 명령어 출력
//        log.info("FFmpeg command: {}", String.join(" ", command));
//
//        return command;
//    }
private List<String> buildFFmpegCommand(String video1Path, String video2Path, String outputFilePath, boolean horizontal) {
    List<String> command = new ArrayList<>();
    command.add(ffmpegPath);

    // 입력 설정
    command.add("-hwaccel");
    command.add("cuda");
    command.add("-i");
    command.add(video1Path);
    command.add("-hwaccel");
    command.add("cuda");
    command.add("-i");
    command.add(video2Path);

    command.add("-filter_complex");

    StringBuilder filterComplex = new StringBuilder();

    // 기본 크기 설정 (1:√2 비율 적용)
    int baseWidth = 720;
    int baseHeight = (int)(baseWidth * Math.sqrt(2));

    if (horizontal) {
        // 가로로 합칠 때
        filterComplex.append("[0:v]scale=").append(baseWidth).append(":").append(baseHeight).append("[v0];");
        filterComplex.append("[1:v]scale=").append(baseWidth).append(":").append(baseHeight).append("[v1];");
        filterComplex.append("[v0][v1]hstack=inputs=2[v]");
    } else {
        // 세로로 합칠 때
        filterComplex.append("[0:v]scale=").append(baseHeight).append(":").append(baseWidth).append("[v0];");
        filterComplex.append("[1:v]scale=").append(baseHeight).append(":").append(baseWidth).append("[v1];");
        filterComplex.append("[v0][v1]vstack=inputs=2[v]");
    }

    command.add(filterComplex.toString());

    // 출력 설정
    command.add("-map");
    command.add("[v]");
    command.add("-c:v");
    command.add("hevc_nvenc");
    command.add("-preset");
    command.add("p1");
    command.add("-rc:v");
    command.add("constqp");
    command.add("-qp");
    command.add("27");

    // 오디오 설정 (첫 번째 영상의 오디오 사용)
    command.add("-map");
    command.add("0:a?");
    command.add("-c:a");
    command.add("aac");

    command.add(outputFilePath);

    return command;
}

    // 동기 메소드로 변경
    public String mergeVideosHorizontally(String video1Path, String video2Path) {
        validateInputFiles(video1Path, video2Path);
        return mergeVideos(video1Path, video2Path, true);
    }

    public String mergeVideosVertically(String video1Path, String video2Path) {
        validateInputFiles(video1Path, video2Path);
        return mergeVideos(video1Path, video2Path, false);
    }

    private void validateInputFiles(String video1Path, String video2Path) {
        File video1File = new File(video1Path);
        File video2File = new File(video2Path);

        if (!video1File.exists()) {
            throw new IllegalArgumentException("First video file not found: " + video1Path);
        }
        if (!video2File.exists()) {
            throw new IllegalArgumentException("Second video file not found: " + video2Path);
        }
        if (!video1File.canRead()) {
            throw new IllegalArgumentException("Cannot read first video file: " + video1Path);
        }
        if (!video2File.canRead()) {
            throw new IllegalArgumentException("Cannot read second video file: " + video2Path);
        }
    }

    private String mergeVideos(String video1Path, String video2Path, boolean horizontal) {
        try {
            String outputFileName = "merged_" + UUID.randomUUID().toString() + ".mp4";
            String outputFilePath = System.getProperty("java.io.tmpdir") + File.separator + outputFileName;
            File outputFile = new File(outputFilePath);

            // FFmpeg 명령 실행
            List<String> command = buildFFmpegCommand(video1Path, video2Path, outputFilePath, horizontal);
            log.info("Executing FFmpeg command: {}", String.join(" ", command));

            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            // 로그 처리
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                    log.info("FFmpeg: {}", line);
                }
            }

            // 프로세스 완료 대기 (타임아웃 10분 설정)
            if (!process.waitFor(10, TimeUnit.MINUTES)) {
                process.destroy();
                throw new RuntimeException("FFmpeg process timed out after 10 minutes");
            }

            int exitCode = process.exitValue();
            if (exitCode != 0) {
                throw new RuntimeException("FFmpeg process failed with exit code: " + exitCode + "\nOutput: " + output);
            }

            if (!outputFile.exists()) {
                throw new RuntimeException("Output file was not created: " + outputFilePath);
            }

            return outputFilePath;

        } catch (IOException | InterruptedException e) {
            log.error("Error merging videos", e);
            throw new RuntimeException("Failed to merge videos: " + e.getMessage(), e);
        }
    }

//    private List<String> buildFFmpegCommand(String video1Path, String video2Path, String outputFilePath, boolean horizontal) {
//        List<String> command = new ArrayList<>();
//        command.add(ffmpegPath);
//
//        // 첫 번째 입력에 대한 하드웨어 가속 설정
//        command.add("-hwaccel");
//        command.add("cuda");     // NVIDIA GPU 사용시
//        command.add("-i");
//        command.add(video1Path);
//
//        // 두 번째 입력에 대한 하드웨어 가속 설정
//        command.add("-hwaccel");
//        command.add("cuda");     // NVIDIA GPU 사용시
//        command.add("-i");
//        command.add(video2Path);
//
//        // 인코딩 성능 최적화 설정
//        command.add("-preset");
//        command.add("p1");      // NVIDIA용 가장 빠른 프리셋
//
//        // 필터 설정
//        command.add("-filter_complex");
//        String stackFilter = horizontal ? "hstack" : "vstack";
//        command.add("[0:v][1:v]scale2ref=oh*mdar:ih[v0][v1];[v0][v1]" + stackFilter + "=inputs=2[v]");
//
//        command.add("-map");
//        command.add("[v]");
//
//        // 출력 인코더 설정
//        command.add("-c:v");
//        command.add("h264_nvenc");
//
//        // 최적화된 인코딩 설정
//        command.add("-rc:v");
//        command.add("constqp");
//        command.add("-qp");
//        command.add("27");
//
//        command.add("-c:a");
//        command.add("aac");
//
//        command.add(outputFilePath);
//
//        // 디버깅을 위한 전체 명령어 출력
//        log.info("FFmpeg command: {}", String.join(" ", command));
//
//        return command;
//    }

    public void cleanupTempFiles(File... files) {
        for (File file : files) {
            if (file != null && file.exists()) {
                boolean deleted = file.delete();
                if (!deleted) {
                    log.warn("Failed to delete temporary file: {}", file.getAbsolutePath());
                }
            }
        }
    }
}