package Blendeo.backend.project.dto;

import Blendeo.backend.project.entity.Project;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Getter
@NoArgsConstructor
public class ProjectCreateReq {
    private String title;
    private String content;
    private boolean state;
    private MultipartFile videoFile;

    @Builder
    public ProjectCreateReq(String title, String content, boolean state, MultipartFile videoFile) {
        this.title = title;
        this.content = content;
        this.state = state;
        this.videoFile = videoFile;
    }
}
