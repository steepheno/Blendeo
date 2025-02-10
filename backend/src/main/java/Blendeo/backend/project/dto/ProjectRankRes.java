package Blendeo.backend.project.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectRankRes {
    private long id;
    private String title;
    private int userId;
    private String userNickName;

    @Builder
    public ProjectRankRes(long projectId, String projectTitle, int userId, String userNickName) {
        this.id = projectId;
        this.title = projectTitle;
        this.userId = userId;
        this.userNickName = userNickName;
    }
}
