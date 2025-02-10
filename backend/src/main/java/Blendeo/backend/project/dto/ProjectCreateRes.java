package Blendeo.backend.project.dto;

import Blendeo.backend.instrument.dto.InstrumentGetRes;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class ProjectCreateRes {
    private Long projectId;
    private List<InstrumentGetRes> projectInstruments;
    private List<InstrumentGetRes> etcInstruments;

    @Builder
    public ProjectCreateRes(Long projectId, List<InstrumentGetRes> projectInstruments, List<InstrumentGetRes> etcInstruments) {
        this.projectId = projectId;
        this.projectInstruments = projectInstruments;
        this.etcInstruments = etcInstruments;
    }
}
