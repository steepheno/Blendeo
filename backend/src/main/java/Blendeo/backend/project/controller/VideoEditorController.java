package Blendeo.backend.project.controller;

import Blendeo.backend.project.service.VideoEditorService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/project/video/editor")
@RequiredArgsConstructor
public class VideoEditorController {

    private final VideoEditorService videoEditorService;

    @Operation(summary = "forkedUrl == null || forkedUrl.isEmpty() 이라면, 첫 영상!")
    @PostMapping(path = "/blend",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> blendVideo(@RequestParam("forkedUrl") MultipartFile forkedUrl, @RequestParam("videoFile") MultipartFile videoFile) {
        // forkedUrl == null 이라면, 첫 영상!
        if (forkedUrl == null || forkedUrl.isEmpty()) {
            String uploadedUrl = videoEditorService.uploadVideo(videoFile);
            return ResponseEntity.ok(uploadedUrl);
        } else {

            // 두 영상 합치기
            String blendedUrl = videoEditorService.blendTwoVideo(forkedUrl, videoFile);
            return ResponseEntity.ok(blendedUrl);
        }
    }
}
