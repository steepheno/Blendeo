package Blendeo.backend.project.dto;

import Blendeo.backend.instrument.dto.InstrumentGetRes;
import lombok.Builder;
import lombok.Getter;

import java.net.URL;
import java.util.List;

@Getter
public class ProjectContributeInfoRes {
    private int userId;
    private String nickname;
    private URL profileImage;
    private List<InstrumentGetRes> instruments;
    private List<InstrumentGetRes> etcInstruments;

    @Builder
    public ProjectContributeInfoRes(int userId, String nickname, URL profileImage, List<InstrumentGetRes> instruments, List<InstrumentGetRes> etcInstruments) {
        this.userId = userId;
        this.nickname = nickname;
        this.profileImage = profileImage;
        this.instruments = instruments;
        this.etcInstruments = etcInstruments;
    }
}
