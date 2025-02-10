package Blendeo.backend.project.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ProjectHierarchyRes {
    private Long id;
    private String title;
    private String thumbnail;
    private String authorNickname;
    private int viewCnt;
    private List<ProjectHierarchyRes> children;
}