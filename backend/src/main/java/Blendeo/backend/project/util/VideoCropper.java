package Blendeo.backend.project.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
@Slf4j
public class VideoCropper {

    @Value("${ffmpeg.path:/usr/bin/ffmpeg}")
    private String ffmpegPath;

    public File crop(File inputFile, double startPoint, double duration) {
        try {
            // 출력 파일 생성
            File outputFile = File.createTempFile("output_", ".mp4");

            // FFmpeg 명령어 구성 - 더 안정적인 설정으로 변경
            List<String> command = new ArrayList<>();
            command.add(ffmpegPath);

            // 기본 가속 설정
            command.add("-hwaccel");
            command.add("cuda");

            // 시작 시점 설정
            command.add("-ss");
            command.add(String.valueOf(startPoint));

            // 입력 파일
            command.add("-i");
            command.add(inputFile.getAbsolutePath());

            // 지속 시간
            command.add("-t");
            command.add(String.valueOf(duration));

            // 비디오 설정 - 안정적인 옵션으로 설정
            command.add("-c:v");
            command.add("h264_nvenc");
            command.add("-preset");
            command.add("medium");  // p1 대신 더 안정적인 medium 사용
            command.add("-b:v");
            command.add("5M");

            // 오디오 설정
            command.add("-c:a");
            command.add("copy");  // 오디오는 복사만 수행

            // 멀티스레딩 설정
            command.add("-threads");
            command.add("0");  // 자동으로 적절한 스레드 수 선택

            // 강제 포맷 지정
            command.add("-f");
            command.add("mp4");

            // 출력 파일 덮어쓰기
            command.add("-y");
            command.add(outputFile.getAbsolutePath());

            // 실행할 명령어 로깅
            logCommand(command);

            // FFmpeg 실행
            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true);

            log.info("Starting FFmpeg process...");
            Process process = pb.start();

            // 출력 읽기
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                    log.info("FFmpeg: {}", line);
                }
            }

            // 프로세스 완료 대기
            int exitCode = process.waitFor();

            if (exitCode != 0) {
                log.error("FFmpeg failed with exit code: {} and output: {}", exitCode, output.toString());
                throw new RuntimeException("FFmpeg process failed with exit code: " + exitCode);
            }

            // 출력 파일 확인 (더 자세한 검증)
            if (!outputFile.exists()) {
                log.error("Output file does not exist: {}", outputFile.getAbsolutePath());
                throw new RuntimeException("Output file was not created");
            }

            if (outputFile.length() == 0) {
                log.error("Output file is empty: {}", outputFile.getAbsolutePath());
                throw new RuntimeException("Output file is empty");
            }

            log.info("Video cropping completed successfully! Output file size: {} bytes", outputFile.length());
            return outputFile;

        } catch (IOException | InterruptedException e) {
            log.error("Error during video cropping", e);
            throw new RuntimeException("Failed to crop video", e);
        }
    }

    private void logCommand(List<String> command) {
        StringBuilder cmdStr = new StringBuilder();
        for (String s : command) {
            cmdStr.append(s).append(" ");
        }
        log.info("Executing FFmpeg command: {}", cmdStr.toString());

        // 입력 파일 확인
        File input = new File(command.get(command.indexOf("-i") + 1));
        log.info("Input file exists: {}, size: {} bytes", input.exists(), input.length());
    }
}