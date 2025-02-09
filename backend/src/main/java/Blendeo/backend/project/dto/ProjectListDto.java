package Blendeo.backend.project.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProjectListDto {
    private Long projectId;
    private String projectTitle;
    private String thumbnail;
    private int viewCnt;
    private int forkCnt;
    private int contributionCnt;
    private int authorId;
    private String authorNickname;

    @Builder
    public ProjectListDto(Long projectId, String projectTitle, String thumbnail, int viewCnt, int forkCnt, int contributionCnt, int authorId, String authorNickname) {
        this.projectId = projectId;
        this.projectTitle = projectTitle;
        this.thumbnail = thumbnail;
        this.viewCnt = viewCnt;
        this.forkCnt = forkCnt;
        this.contributionCnt = contributionCnt;
        this.authorId = authorId;
        this.authorNickname = authorNickname;
    }
}