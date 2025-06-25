package Blendeo.backend.project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProjectHierarchyDto {
    private Long id;
    private Long forkId;
    private String title;
    private String authorName;
    // 필요한 필드만 포함
}