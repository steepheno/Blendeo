package Blendeo.backend.user.dto;

import lombok.Getter;

@Getter
public class UserInfoGetRes {
    private int id;
    private String email;
    private String nickname;
    private String profileImage;

    public UserInfoGetRes(int id, String email, String nickname, String profileImage) {
        this.id = id;
        this.email = email;
        this.nickname = nickname;
        this.profileImage = profileImage;
    }
}
