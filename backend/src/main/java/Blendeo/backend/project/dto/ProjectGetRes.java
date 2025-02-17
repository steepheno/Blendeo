package Blendeo.backend.project.dto;

import Blendeo.backend.instrument.dto.InstrumentGetRes;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.net.URL;
import java.time.LocalDateTime;
import java.util.List;

@ToString
@NoArgsConstructor
@Getter
public class ProjectGetRes {
    private Long projectId;
    private Long forkId;
    private String title;
    private String contents;
    private int contributorCnt;
    private int authorId;
    private String authorNickname;
    private URL authorProfileImage;
    private int likeCnt;
    private int commentCnt;
    private URL thumbnail;
    private URL videoUrl;
    private int duration;
    private int viewCnt;
    private List<InstrumentGetRes> projectInstruments;
    private List<InstrumentGetRes> etcInstruments;
    private LocalDateTime createdAt;
    private boolean state;
    private int instrumentCnt;

    @Builder
    public ProjectGetRes(Long id, Long forkId, String title, String contents, int contributorCnt,
                         int authorId, String authorNickname, URL authorProfileImage,
                         LocalDateTime createdAt, boolean state, int likeCnt, int commentCnt, URL thumbnail, int runningTime,
                         int viewCnt, URL videoUrl, List<InstrumentGetRes> projectInstruments, List<InstrumentGetRes> etcInstruments, int instrumentCnt) {
        this.projectId = id;
        this.forkId = forkId;
        this.title = title;
        this.contents = contents;
        this.contributorCnt = contributorCnt;
        this.authorId = authorId;
        this.authorNickname = authorNickname;
        this.authorProfileImage = authorProfileImage;
        this.createdAt = createdAt;
        this.state = state;
        this.likeCnt = likeCnt;
        this.commentCnt = commentCnt;
        this.thumbnail = thumbnail;
        this.duration = runningTime;
        this.viewCnt = viewCnt;
        this.videoUrl = videoUrl;
        this.projectInstruments = projectInstruments;
        this.etcInstruments = etcInstruments;
        this.instrumentCnt = instrumentCnt;
    }
}
