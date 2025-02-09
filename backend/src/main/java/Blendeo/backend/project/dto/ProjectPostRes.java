package Blendeo.backend.project.dto;

import Blendeo.backend.instrument.dto.InstrumentGetRes;
import Blendeo.backend.instrument.entity.ProjectInstrument;
import Blendeo.backend.project.entity.Project;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class ProjectPostRes {
    private Long projectId;
    private List<InstrumentGetRes> projectInstruments;
    private List<InstrumentGetRes> etcInstruments;

    @Builder
    public ProjectPostRes(Long projectId, List<InstrumentGetRes> projectInstruments, List<InstrumentGetRes> etcInstruments) {
        this.projectId = projectId;
        this.projectInstruments = projectInstruments;
        this.etcInstruments = etcInstruments;
    }
}
