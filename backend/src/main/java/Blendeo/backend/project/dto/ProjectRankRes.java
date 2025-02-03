package Blendeo.backend.project.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectRankRes {
    private long projectId;
    private String projectTitle;
    private int userId;
    private String userNickName;

    @Builder
    public ProjectRankRes(long projectId, String projectTitle, int userId, String userNickName) {
        this.projectId = projectId;
        this.projectTitle = projectTitle;
        this.userId = userId;
        this.userNickName = userNickName;
    }
}
