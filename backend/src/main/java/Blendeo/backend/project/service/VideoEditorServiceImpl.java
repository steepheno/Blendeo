package Blendeo.backend.project.service;

import Blendeo.backend.global.util.S3Utils;
import Blendeo.backend.project.util.VideoDurationExtractor;
import Blendeo.backend.project.util.VideoInfoGetter;
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

    private final VideoDurationExtractor videoDurationExtractor;
    private final VideoMerger videoMerger;
    private final VideoInfoGetter videoInfo;
    private final S3Utils s3Utils;
    @Value("${aws.s3.video.dir}")
    private String videoDir;

    public int getLength(String url) {
        File tempFile = null;
        try {
            tempFile = s3Utils.extractFileFromS3(url);
            int duration = videoDurationExtractor.extractVideoDuration(tempFile);

            videoMerger.cleanupTempFiles(tempFile);
            return duration;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

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
            log.error("Error processing video upload request", e);
            throw new RuntimeException("비디오 업로드에 실패", e);
        } finally {
            // 임시 파일 삭제
            videoMerger.cleanupTempFiles(tempFile);
        }
    }

    @Override
    public String blendTwoVideo(String forkedUrl, MultipartFile videoFile) {
        File tempVideo1 = null;
        File tempVideo2 = null;

        File mergedVideo = null;
        String mergedVideoPath = null;

        String mergedVideoUrl = null;

        try {
            // forkedUrl -> 영상 파일 가져오기
            tempVideo1 = s3Utils.extractFileFromS3(forkedUrl);

            // 랜덤한 이름으로 temp 파일 생성
            tempVideo2 = File.createTempFile("video2_"+ UUID.randomUUID().toString(), ".mp4");

            // MultipartFile을 임시 파일로 저장
            videoFile.transferTo(tempVideo2);

            /* forkedFile 영상의 너비와 높이 구해서 세로, 가로 방향 정하기 => 반복 적용 후 수정 필요함!! */
            VideoInfoGetter.Info info = videoInfo.getVideoInfo(tempVideo1.getPath());

            if (info.width > info.height) { // 너비가 더 길다

                // 비디오 아래로 합치기
                mergedVideoPath = videoMerger.mergeVideosVertically
                        (
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
