package Blendeo.backend.project.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Getter
@NoArgsConstructor
public class ProjectCreateReq {
    private String title;
    private String content;
    private int userId;
    private Long forkProjectId;
    private boolean state;
    private MultipartFile videoFile;

    @Builder
    public ProjectCreateReq(String title, String content, int userId, Long forkProjectId, boolean state, MultipartFile videoFile) {
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.forkProjectId = forkProjectId;
        this.state = state;
        this.videoFile = videoFile;
    }
}
