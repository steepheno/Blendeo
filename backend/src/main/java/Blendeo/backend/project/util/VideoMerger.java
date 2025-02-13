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

    private List<String> buildFFmpegCommand(String video1Path, String video2Path, String outputFilePath, boolean horizontal, int loopCnt) {
        List<String> command = new ArrayList<>();
        command.add(ffmpegPath);

        // CUDA 하드웨어 가속 최적화
        command.add("-hwaccel_output_format");
        command.add("cuda");

        // 첫 번째 영상 1+2번 반복
        command.add("-stream_loop");
        command.add(String.valueOf(loopCnt - 1));

        // 입력 비디오 1
        command.add("-i");
        command.add(video1Path);

        // 입력 비디오 2
        command.add("-i");
        command.add(video2Path);


        // 필터 설정
        command.add("-filter_complex");

        StringBuilder filterComplex = new StringBuilder();
        int baseWidth = 720;
        int baseHeight = (int) (baseWidth * Math.sqrt(2));

        if (horizontal) {
            filterComplex.append("[0:v]scale=").append(baseWidth).append(":").append(baseHeight).append("[v0];");
            filterComplex.append("[1:v]scale=").append(baseWidth).append(":").append(baseHeight).append("[v1];");
            filterComplex.append("[v0][v1]hstack=inputs=2[v];[0:a][1:a]amerge=inputs=2[a]");
        } else {
            filterComplex.append("[0:v]scale=").append(baseHeight).append(":").append(baseWidth).append("[v0];");
            filterComplex.append("[1:v]scale=").append(baseHeight).append(":").append(baseWidth).append("[v1];");
            filterComplex.append("[v0][v1]vstack=inputs=2[v];[0:a][1:a]amerge=inputs=2[a]");
        }

        command.add(filterComplex.toString());

        // 출력 설정
        command.add("-map");
        command.add("[v]");
        command.add("-map");
        command.add("[a]");

        // 비디오 인코딩 설정
        command.add("-c:v");
        command.add("hevc_nvenc");  // HEVC 사용 (H.264로 바꾸려면 h264_nvenc)

        command.add("-threads");
        command.add("4");

        command.add("-rc:v");
        command.add("constqp");
        command.add("-qp");
        command.add("27");

        command.add("-c:a");
        command.add("aac");
        command.add("-ac");
        command.add("2");

        command.add("-bsf:v");
        command.add("hevc_mp4toannexb");

        command.add(outputFilePath);

        System.out.println("FFmpeg Command: " + String.join(" ", command));

        return command;
    }


    // 동기 메소드로 변경
    public String mergeVideosHorizontally(String video1Path, String video2Path, int loopCnt) {
        validateInputFiles(video1Path, video2Path);
        return mergeVideos(video1Path, video2Path, true, loopCnt);
    }

    public String mergeVideosVertically(String video1Path, String video2Path, int loopCnt) {
        validateInputFiles(video1Path, video2Path);
        return mergeVideos(video1Path, video2Path, false, loopCnt);
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

    private String mergeVideos(String video1Path, String video2Path, boolean horizontal, int loopCnt) {
        try {
            String outputFileName = "merged_" + UUID.randomUUID().toString() + ".mp4";
            String outputFilePath = System.getProperty("java.io.tmpdir") + File.separator + outputFileName;
            File outputFile = new File(outputFilePath);

            // FFmpeg 명령 실행
            List<String> command = buildFFmpegCommand(video1Path, video2Path, outputFilePath, horizontal, loopCnt);
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