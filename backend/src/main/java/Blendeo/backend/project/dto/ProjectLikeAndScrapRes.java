package Blendeo.backend.project.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@NoArgsConstructor
@Getter
public class ProjectLikeAndScrapRes {
    private boolean isLiked;
    private boolean isScraped;

    @Builder
    public ProjectLikeAndScrapRes(boolean isLiked, boolean isScraped) {
        this.isLiked = isLiked;
        this.isScraped = isScraped;
    }
}
