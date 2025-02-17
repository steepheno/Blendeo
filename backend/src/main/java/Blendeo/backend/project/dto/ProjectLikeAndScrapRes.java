package Blendeo.backend.project.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@NoArgsConstructor
@Getter
public class ProjectLikeAndScrapRes {
    private boolean is_like;
    private boolean is_scrap;

    @Builder
    public ProjectLikeAndScrapRes(boolean is_like, boolean is_scrap) {
        this.is_like = is_like;
        this.is_scrap = is_scrap;
    }
}
