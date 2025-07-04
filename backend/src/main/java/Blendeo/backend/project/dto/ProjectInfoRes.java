package Blendeo.backend.project.dto;

import Blendeo.backend.instrument.dto.InstrumentGetRes;
import Blendeo.backend.instrument.entity.EtcInstrument;
import Blendeo.backend.instrument.entity.ProjectInstrument;
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
public class ProjectInfoRes {
    private Long projectId;
    private Long forkId;
    private String title;
    private String contents;
    private int contributorCnt;
    private boolean state;
    private URL thumbnail;
    private URL videoUrl;
    private int duration;
    private int viewCnt;
    private List<InstrumentGetRes> projectInstruments;
    private List<InstrumentGetRes> etcInstruments;
    private LocalDateTime createdAt;

    @Builder
    public ProjectInfoRes(Long id, Long forkId, String title, String contents, int contributorCnt, LocalDateTime createdAt, boolean state, URL thumbnail, int runningTime, int viewCnt, URL videoUrl, List<InstrumentGetRes> projectInstruments, List<InstrumentGetRes> etcInstruments) {
        this.projectId = id;
        this.forkId = forkId;
        this.title = title;
        this.contents = contents;
        this.contributorCnt = contributorCnt;
        this.createdAt = createdAt;
        this.state = state;
        this.thumbnail = thumbnail;
        this.duration = runningTime;
        this.viewCnt = viewCnt;
        this.videoUrl = videoUrl;
        this.projectInstruments = projectInstruments;
        this.etcInstruments = etcInstruments;
    }
}
