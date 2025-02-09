package Blendeo.backend.project.dto;

import Blendeo.backend.instrument.dto.InstrumentGetRes;
import Blendeo.backend.instrument.entity.EtcInstrument;
import Blendeo.backend.instrument.entity.ProjectInstrument;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@ToString
@NoArgsConstructor
@Getter
public class ProjectInfoRes {
    private Long id;
    private Long forkId;
    private String projectTitle;
    private String contents;
    private int contributorCnt;
    private LocalDateTime createdAt;
    private boolean state;
    private String thumbnail;
    private String videoUrl;
    private int runningTime;
    private int viewCnt;
    private List<InstrumentGetRes> projectInstruments;
    private List<InstrumentGetRes> etcInstruments;

    @Builder
    public ProjectInfoRes(Long id, Long forkId, String projectTitle, String contents, int contributorCnt, LocalDateTime createdAt, boolean state, String thumbnail, int runningTime, int viewCnt, String videoUrl, List<InstrumentGetRes> projectInstruments, List<InstrumentGetRes> etcInstruments) {
        this.id = id;
        this.forkId = forkId;
        this.projectTitle = projectTitle;
        this.contents = contents;
        this.contributorCnt = contributorCnt;
        this.createdAt = createdAt;
        this.state = state;
        this.thumbnail = thumbnail;
        this.runningTime = runningTime;
        this.viewCnt = viewCnt;
        this.videoUrl = videoUrl;
        this.projectInstruments = projectInstruments;
        this.etcInstruments = etcInstruments;
    }
}
