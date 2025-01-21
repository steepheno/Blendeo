package Blendeo.backend.user.dto;

import lombok.Getter;

@Getter
public class UserUpdatePutReq {
    private int id;
    private String nickname;
    private String profile_image;

    public UserUpdatePutReq(int id, String nickname, String profile_image) {
        this.id = id;
        this.nickname = nickname;
        this.profile_image = profile_image;
    }
}
