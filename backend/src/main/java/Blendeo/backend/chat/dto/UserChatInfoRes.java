package Blendeo.backend.chat.dto;

import lombok.Builder;
import lombok.Getter;

import java.net.URL;

@Getter
public class UserChatInfoRes {
    private int userId;
    private String email;
    private URL profileImage;

    @Builder
    public UserChatInfoRes(int userId, String email, URL profileImage) {
        this.userId = userId;
        this.email = email;
        this.profileImage = profileImage;
    }
}
