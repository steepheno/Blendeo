package Blendeo.backend.project.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@ToString
@NoArgsConstructor
@Getter
public class ProjectInfoRes {
    private Long id;
    private Long forkId;
    private String projectTitle;
    private String contents;
    private int contributorCnt;
    private LocalDateTime createdAt;
    private boolean state;
    private String thumbnail;
    private int runningTime;
    private int viewCnt;

    @Builder
    public ProjectInfoRes(Long id, Long forkId, String projectTitle, String contents, int contributorCnt, LocalDateTime createdAt, boolean state, String thumbnail, int runningTime, int viewCnt) {
        this.id = id;
        this.forkId = forkId;
        this.projectTitle = projectTitle;
        this.contents = contents;
        this.contributorCnt = contributorCnt;
        this.createdAt = createdAt;
        this.state = state;
        this.thumbnail = thumbnail;
        this.runningTime = runningTime;
        this.viewCnt = viewCnt;
    }
}
