package Blendeo.backend.project.dto;

import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectScrapRes {
    private Long projectId;
    private String projectName;
    private int authorId;
    private String authorNickname;
    private LocalDateTime createdAt;
    private int viewCnt;

    @Builder
    public ProjectScrapRes(Long projectId, String projectName, int authorId, String authorNickname, LocalDateTime createdAt, int viewCnt){
        this.projectId = projectId;
        this.projectName = projectName;
        this.authorId = authorId;
        this.authorNickname = authorNickname;
        this.createdAt = createdAt;
        this.viewCnt = viewCnt;
    }
}