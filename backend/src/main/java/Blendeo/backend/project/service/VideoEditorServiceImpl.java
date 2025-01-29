package Blendeo.backend.project.service;

import Blendeo.backend.global.util.S3Utils;
import Blendeo.backend.project.util.VideoInfo;
import Blendeo.backend.project.util.VideoMerger;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class VideoEditorServiceImpl implements VideoEditorService {

    private final VideoMerger videoMerger;
    private final VideoInfo videoInfo;
    private final S3Utils s3Utils;
    @Value("${aws.s3.video.dir}")
    private String videoDir;

    @Override
    public String uploadVideo(MultipartFile videoFile) {
        File tempFile = null;
        try {
            // temp 파일 생성
            tempFile = File.createTempFile("video", ".mp4");

            // Multipart -> File 형식으로 변환
            videoFile.transferTo(tempFile);

            String filename = videoDir + "/origin_" + UUID.randomUUID().toString() + ".mp4";
            // S3에 영상 업로드
            s3Utils.uploadToS3(tempFile, filename, "video/mp4");

            // S3 링크 반환
            return s3Utils.getUrlByFileName(filename);
        } catch (Exception e) {
            log.error("Error processing video merge request", e);
            throw new RuntimeException("Failed to merge videos", e);
        } finally {
            // 임시 파일 삭제
            videoMerger.cleanupTempFiles(tempFile);
        }
    }

    @Override
    public String blendTwoVideo(MultipartFile forkedUrl, MultipartFile videoFile) {

        File tempVideo1 = null;
        File tempVideo2 = null;
        File tempOutputVideo = null;

        File mergedVideo = null;
        String mergedVideoPath = null;

        String mergedVideoUrl = null;

        try {
            // 랜덤한 이름으로 temp 파일 생성
            tempVideo1 = File.createTempFile("video1_" + UUID.randomUUID().toString(), ".mp4");
            tempVideo2 = File.createTempFile("video2_"+ UUID.randomUUID().toString(), ".mp4");
            tempOutputVideo = File.createTempFile("output_"+ System.currentTimeMillis(), ".mp4");

            // MultipartFile을 임시 파일로 저장
            forkedUrl.transferTo(tempVideo1);
            videoFile.transferTo(tempVideo2);

            /* forkedFile 영상의 너비와 높이 구해서 세로, 가로 방향 정하기 */
            VideoInfo.Info info = videoInfo.getVideoInfo(tempVideo1.getPath());

            if (info.width > info.height) { // 너비가 더 길다
                // 비디오 아래로 합치기
                mergedVideoPath = videoMerger.mergeVideosVertically(
                        tempVideo1.getAbsolutePath(),
                        tempVideo2.getAbsolutePath()
                );
            } else {
                // 비디오 옆으로 합치기
                mergedVideoPath = videoMerger.mergeVideosHorizontally(
                        tempVideo1.getAbsolutePath(),
                        tempVideo2.getAbsolutePath()
                );
            }
        } catch (Exception e) {
            log.error("Error processing video merge request", e);
            throw new RuntimeException("Failed to merge videos", e);
        }

        // 병합된 비디오 파일 생성
        mergedVideo = new File(mergedVideoPath);

        // S3에 업로드
        String fileName = videoDir + "/merged_" + UUID.randomUUID() + ".mp4";
        s3Utils.uploadToS3(mergedVideo, fileName, "video/mp4");

        // S3 URL 생성
        mergedVideoUrl = s3Utils.getUrlByFileName(fileName);

        // 임시 파일 삭제
        videoMerger.cleanupTempFiles(tempVideo1, tempVideo2, mergedVideo);

        return mergedVideoUrl;
    }
}
