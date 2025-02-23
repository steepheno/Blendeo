package Blendeo.backend.project.dto;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class ProjectHierarchyRes2 {
    private Long id;
    private Long forkId;
    private int authorId;
    private String title;
    private String contents;
    private int contributorCnt;
    private String thumbnail;
    private int runningTime;
    private String videoUrl;
    private int viewCnt;
    private boolean state;
    private LocalDateTime createdAt;
    private int instrumentCnt;
}
