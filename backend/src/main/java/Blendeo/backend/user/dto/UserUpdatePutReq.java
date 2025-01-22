package Blendeo.backend.user.dto;

import lombok.Getter;

@Getter
public class UserUpdatePutReq {
    private int id;
    private String nickname;
    private String profileImage;

    public UserUpdatePutReq(int id, String nickname, String profileImage) {
        this.id = id;
        this.nickname = nickname;
        this.profileImage = profileImage;
    }
}
