package Blendeo.backend.user.dto;

import Blendeo.backend.instrument.dto.InstrumentGetRes;
import lombok.Builder;
import lombok.Getter;

import java.net.URL;
import java.util.List;

@Getter
public class UserInfoGetRes {
    private int id;
    private String email;
    private String nickname;
    private URL profileImage;
    private URL header;
    private String intro;
    private List<InstrumentGetRes> instruments;

    public void setInstruments(List<InstrumentGetRes> instruments) {
        this.instruments = instruments;
    }

    @Builder
    public UserInfoGetRes(int id, String email, String nickname, URL profileImage, URL header, String intro, List<InstrumentGetRes> instruments) {
        this.id = id;
        this.email = email;
        this.nickname = nickname;
        this.profileImage = profileImage;
        this.header = header;
        this.intro = intro;
        this.instruments = instruments;
    }
}
