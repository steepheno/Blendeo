package Blendeo.backend.user.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
public class UserLoginPostRes {
    private int id;
    private String email;
    private String nickname;
    private String profileImage;
    private String accessToken;
    private String refreshToken;
}
