package Blendeo.backend.user.dto;

import lombok.Getter;

@Getter
public class UserInfoGetRes {
    private int id;
    private String email;
    private String nickname;
    private String profile_image;

    public UserInfoGetRes(int id, String email, String nickname, String profile_image) {
        this.id = id;
        this.email = email;
        this.nickname = nickname;
        this.profile_image = profile_image;
    }
}
