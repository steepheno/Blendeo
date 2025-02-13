package Blendeo.backend.project.service;

import Blendeo.backend.global.util.S3Utils;
import Blendeo.backend.project.util.VideoCropper;
import Blendeo.backend.project.util.VideoDurationExtractor;
import Blendeo.backend.project.util.VideoInfoGetter;
import Blendeo.backend.project.util.VideoMerger;
import Blendeo.backend.project.util.VideoThumbnailExtractor;
import com.amazonaws.util.IOUtils;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.net.URL;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class VideoEditorServiceImpl implements VideoEditorService {

    private final VideoDurationExtractor videoDurationExtractor;
    private final VideoThumbnailExtractor videoThumbnailExtractor;
    private final VideoMerger videoMerger;
    private final VideoInfoGetter videoInfo;
    private final S3Utils s3Utils;
    private final VideoCropper videoCropper;
    @Value("${aws.s3.video.dir}")
    private String videoDir;

    public URL getThumbnailUrl(String videoUrl) {
        File tempFile = null;
        try {
            tempFile = s3Utils.extractFileFromS3(videoUrl);
            URL thumbnailUrl = videoThumbnailExtractor.extractThumbnail(tempFile);

            videoMerger.cleanupTempFiles(tempFile);
            return thumbnailUrl;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @Override
    public MultipartFile crobVideo(MultipartFile videoFile, double startPoint, double duration) {

        return null;
    }

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
    public String uploadVideo(MultipartFile videoFile, double startPoint, double duration) {
        File tempInputFile = null;
        File croppedFile = null;
        try {
            // MultipartFile을 File로 복사
            tempInputFile = File.createTempFile("input_", ".mp4");

            try (InputStream in = videoFile.getInputStream();
                 OutputStream out = new FileOutputStream(tempInputFile))
            {
                IOUtils.copy(in, out);
            }
            String filename = videoDir + "/origin_" + UUID.randomUUID().toString() + ".mp4";

            if (startPoint > 0) {
                // 영상 자르기
                croppedFile = videoCropper.crop(tempInputFile, startPoint, duration);

                // S3에 영상 업로드
                s3Utils.uploadToS3(croppedFile, filename, "video/mp4");
            }
            else {
                s3Utils.uploadToS3(tempInputFile, filename, "video/mp4");
            }

            // S3 링크 반환
            return s3Utils.getUrlByFileName(filename);
        } catch (Exception e) {
            log.error("Error processing video upload request", e);
            throw new RuntimeException("비디오 업로드에 실패", e);
        } finally {
            // 임시 파일들 삭제
            videoMerger.cleanupTempFiles(tempInputFile);
            videoMerger.cleanupTempFiles(croppedFile);
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
