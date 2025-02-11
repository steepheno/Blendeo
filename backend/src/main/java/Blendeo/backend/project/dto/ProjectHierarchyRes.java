package Blendeo.backend.project.dto;

import Blendeo.backend.project.dto.ProjectNodeLink.Link;
import Blendeo.backend.project.entity.Project;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@NoArgsConstructor
@ToString
public class ProjectHierarchyRes {
    List<ProjectNodeInfo> nodes;
    List<Link> links;

    @Builder
    public ProjectHierarchyRes(List<ProjectNodeInfo> nodes, List<Link> links) {
        this.nodes = nodes;
        this.links = links;
    }

    @ToString
    @Getter
    public static class ProjectNodeInfo {
        private Long projectId;
        private String title;
        private String thumbnail;
        private String authorNickname;
        private int viewCnt;

        @Builder
        public ProjectNodeInfo(Long projectId, String title, String thumbnail, String authorNickname, int viewCnt) {
            this.projectId = projectId;
            this.title = title;
            this.thumbnail = thumbnail;
            this.authorNickname = authorNickname;
            this.viewCnt = viewCnt;
        }

        public static ProjectNodeInfo from(Project project){
            return ProjectNodeInfo.builder()
                    .projectId(project.getId())
                    .title(project.getTitle())
                    .thumbnail(project.getThumbnail())
                    .authorNickname(project.getAuthor().getNickname())
                    .viewCnt(project.getViewCnt())
                    .build();
        }
    }
}
