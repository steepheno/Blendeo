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
            System.out.println("요청 지속 시간: "+duration);
            // 출력 파일 생성
            File outputFile = File.createTempFile("output_", ".mp4");

            // FFmpeg 명령어 구성
            List<String> command = new ArrayList<>();
            command.add(ffmpegPath);

            // 입력 파일 분석 시간 증가
            command.add("-analyzeduration");
            command.add("100M");
            command.add("-probesize");
            command.add("100M");

            // 기본 가속 설정
            command.add("-hwaccel");
            command.add("cuda");

            // 입력 파일
            command.add("-i");
            command.add(inputFile.getAbsolutePath());

            // 시작 시점 설정
            command.add("-ss");
            command.add(String.valueOf(startPoint));

            // 지속 시간
            command.add("-t");
            command.add(String.valueOf(duration));

            // 비디오/오디오 동기화 개선
            command.add("-vsync");
            command.add("1");
            command.add("-async");
            command.add("1");

            // 키프레임 제어
            command.add("-force_key_frames");
            command.add("expr:gte(t,n_forced*1)");

            // 비디오 설정
            command.add("-c:v");
            command.add("h264_nvenc");
            command.add("-preset");
            command.add("medium");
            command.add("-b:v");
            command.add("5M");

            // GOP 크기 설정
            command.add("-g");
            command.add("30");

            // 버퍼 크기 설정
            command.add("-bufsize");
            command.add("5M");

            // 비디오 프로필 설정
            command.add("-profile:v");
            command.add("high");

            // 룩어헤드 설정
            command.add("-rc-lookahead");
            command.add("20");

            // 오디오 설정
            command.add("-c:a");
            command.add("copy");

            // 멀티스레딩 설정
            command.add("-threads");
            command.add("0");

            // 출력 파일 최적화
            command.add("-movflags");
            command.add("+faststart");

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

            // 출력 파일 검증
            validateOutputFile(outputFile);

            // 출력 파일 길이 검증
            validateDuration(outputFile, duration);

            log.info("Video cropping completed successfully! Output file size: {} bytes", outputFile.length());
            return outputFile;

        } catch (IOException | InterruptedException e) {
            log.error("Error during video cropping", e);
            throw new RuntimeException("Failed to crop video", e);
        }
    }

    private void validateOutputFile(File outputFile) {
        if (!outputFile.exists()) {
            log.error("Output file does not exist: {}", outputFile.getAbsolutePath());
            throw new RuntimeException("Output file was not created");
        }

        if (outputFile.length() == 0) {
            log.error("Output file is empty: {}", outputFile.getAbsolutePath());
            throw new RuntimeException("Output file is empty");
        }
    }

    private void validateDuration(File outputFile, double expectedDuration) {
        try {
            System.out.println("지속시간 검증 시작");
            List<String> command = new ArrayList<>();
            command.add(ffmpegPath);
            command.add("-i");
            command.add(outputFile.getAbsolutePath());

            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true);
            Process p = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
            String line;
            double actualDuration = 0;

            while ((line = reader.readLine()) != null) {
                if (line.contains("Duration:")) {
                    String duration = line.split("Duration: ")[1].split(",")[0];
                    String[] timeComponents = duration.split(":");
                    actualDuration = Double.parseDouble(timeComponents[0]) * 3600 +
                            Double.parseDouble(timeComponents[1]) * 60 +
                            Double.parseDouble(timeComponents[2]);
                    break;
                }
            }

            // 허용 오차 범위 설정 (0.5초)
            if (Math.abs(actualDuration - expectedDuration) > 0.05) {
                log.warn("Duration mismatch - Expected: {}, Actual: {}",
                        expectedDuration, actualDuration);

                if (Math.abs(actualDuration - expectedDuration) > 1.0) {
                    // 1초 이상 차이나면 에러로 처리
                    throw new RuntimeException(
                            String.format("Significant duration mismatch - Expected: %.2f, Actual: %.2f",
                                    expectedDuration, actualDuration)
                    );
                }
            }

            p.waitFor();
        } catch (Exception e) {
            log.error("Failed to validate output duration", e);
            throw new RuntimeException("Duration validation failed", e);
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