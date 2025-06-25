package Blendeo.backend.user.dto;

import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

@Getter
public class UserUpdatePutReq {
    private int id;
    private String nickname;

    public UserUpdatePutReq(int id, String nickname) {
        this.id = id;
        this.nickname = nickname;
    }
}
