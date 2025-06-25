package Blendeo.backend.chat.dto;

import lombok.Builder;
import lombok.Getter;

import java.net.URL;

@Getter
public class RoomUserInfoRes {

    private int userId;
    private String email;
    private String nickname;
    private URL profileImage;

    @Builder
    public RoomUserInfoRes(int userId, String email, String nickname, URL profileImage) {
        this.userId = userId;
        this.email = email;
        this.nickname = nickname;
        this.profileImage = profileImage;
    }
}
