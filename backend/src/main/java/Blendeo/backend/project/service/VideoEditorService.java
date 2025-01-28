package Blendeo.backend.project.service;

import org.springframework.web.multipart.MultipartFile;

public interface VideoEditorService {
    String uploadVideo(MultipartFile videoFile);

    String blendTwoVideo(MultipartFile forkedUrl, MultipartFile videoFile);
}
