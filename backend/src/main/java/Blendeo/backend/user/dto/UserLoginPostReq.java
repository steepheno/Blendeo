package Blendeo.backend.user.dto;

import lombok.Getter;

@Getter
public class UserLoginPostReq {
    private String email;
    private String password;
}
