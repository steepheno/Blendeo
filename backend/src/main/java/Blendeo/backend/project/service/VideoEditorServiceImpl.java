package Blendeo.backend.project.service;

import Blendeo.backend.project.util.VideoMerger;
import lombok.RequiredArgsConstructor;
import net.bramp.ffmpeg.FFprobe;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class VideoEditorServiceImpl implements VideoEditorService {

    private final VideoMerger videoMerger;

    @Override
    public String uploadVideo(MultipartFile videoFile) {
        return "";
    }

    @Override
    public String blendTwoVideo(MultipartFile forkedUrl, MultipartFile videoFile) {
        return videoMerger.mergeVideos(forkedUrl, videoFile);
    }
}
