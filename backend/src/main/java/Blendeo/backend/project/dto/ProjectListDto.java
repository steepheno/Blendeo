package Blendeo.backend.project.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.net.URL;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
public class ProjectListDto {
    private Long projectId;
    private String title;
    private String thumbnail;
    private int viewCnt;
    private int contributionCnt;
    private int duration;
    private int authorId;
    private String authorNickname;
    private URL authorProfileImage;
    private List<String> instruments;
    private LocalDateTime createdAt;

    @Builder
    public ProjectListDto(Long projectId, String title, String thumbnail, int viewCnt, int contributionCnt, int duration, int authorId, String authorNickname, URL authorProfileImage, List<String> instruments, LocalDateTime createdAt) {
        this.projectId = projectId;
        this.title = title;
        this.thumbnail = thumbnail;
        this.viewCnt = viewCnt;
        this.contributionCnt = contributionCnt;
        this.duration = duration;
        this.authorId = authorId;
        this.authorNickname = authorNickname;
        this.authorProfileImage = authorProfileImage;
        this.instruments = instruments;
        this.createdAt = createdAt;
    }
}