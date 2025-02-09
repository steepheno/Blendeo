package Blendeo.backend.user.dto;

import lombok.Getter;

import java.net.URL;

@Getter
public class UserInfoGetRes {
    private int id;
    private String email;
    private String nickname;
    private URL profileImage;

    public UserInfoGetRes(int id, String email, String nickname, URL profileImage) {
        this.id = id;
        this.email = email;
        this.nickname = nickname;
        this.profileImage = profileImage;
    }
}
