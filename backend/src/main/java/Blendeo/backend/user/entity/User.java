package Blendeo.backend.user.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class User {
    private int id;
    private String email;
    private String password;
    private String nickname;
}
