package Blendeo.backend.user.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserLoginPostResWithToken {
    private int id;
    private String email;
    private String nickname;
    private String profileImage;
    private String accessToken;
    private String refreshToken;
}