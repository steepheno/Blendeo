package Blendeo.backend.project.util;

import Blendeo.backend.global.util.S3Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class VideoThumnailExtractor {

    @Value("${ffmpeg.path}")
    private String ffmpegPath;
    private final VideoMerger videoMerger;
    private final S3Utils s3Utils;

    public URL extractThumbnail(File videoFile) {
        // 결과 썸네일 파일 생성
        String filename = "thumbnail_" + UUID.randomUUID().toString();
        File thumbnailFile = new File(filename +".jpeg");

        try {
            // FFmpeg 명령어 구성
            ProcessBuilder processBuilder = new ProcessBuilder(
                    ffmpegPath,
                    "-i", videoFile.getAbsolutePath(),    // 입력 비디오 파일
                    "-ss", "00:00:01",                    // 1초 시점의 프레임 추출
                    "-vframes", "1",                      // 1개의 프레임만 추출
                    "-an",                                // 오디오 제외
                    "-s", "1280x720",                     // 썸네일 해상도 설정
                    thumbnailFile.getAbsolutePath()       // 출력 파일 경로
            );

            // FFmpeg 실행
            Process process = processBuilder.start();
            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new RuntimeException("Thumbnail extraction failed with exit code: " + exitCode);
            }

            // 생성된 썸네일을 S3에 업로드하고 URL 반환
            s3Utils.uploadToS3(thumbnailFile, filename + ".jpeg", "thumbnail/jpeg");
            String thumbnailUrl = s3Utils.getUrlByFileName(filename + ".jpeg");
            return new URL(thumbnailUrl);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Thumbnail extraction was interrupted", e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            // 임시 파일 정리
            if (thumbnailFile.exists()) {
                thumbnailFile.delete();
            }
        }

    }
}
