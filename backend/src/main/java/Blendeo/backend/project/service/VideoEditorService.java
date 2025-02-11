package Blendeo.backend.project.service;

import org.springframework.web.multipart.MultipartFile;

import java.net.URL;

public interface VideoEditorService {

    int getLength(String url);

    String uploadVideo(MultipartFile videoFile);

    String blendTwoVideo(String forkedUrl, MultipartFile videoFile);

    URL getThumbnailUrl(String string);
}
