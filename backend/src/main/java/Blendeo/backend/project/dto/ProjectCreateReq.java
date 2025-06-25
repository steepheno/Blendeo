package Blendeo.backend.project.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.net.URL;
import java.util.List;

@Getter
@NoArgsConstructor
public class ProjectCreateReq {
    private String title;
    private String content;
    private int userId;
    private Long forkProjectId;
    private boolean state;
    private int duration;
    private URL thumbnailUrl;
    private URL videoUrl;
    private int instrumentCnt;

    @Builder
    public ProjectCreateReq(String title, String content, int userId, Long forkProjectId, boolean state, int duration, URL thumbnailUrl, URL videoUrl, int instrumentCnt) {
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.forkProjectId = forkProjectId;
        this.state = state;
        this.duration = duration;
        this.thumbnailUrl = thumbnailUrl;
        this.videoUrl = videoUrl;
        this.instrumentCnt = instrumentCnt;
    }
}
