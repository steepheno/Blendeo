package Blendeo.backend.user.dto;

import Blendeo.backend.user.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.aspectj.lang.annotation.RequiredTypes;
import org.checkerframework.checker.units.qual.N;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class UserRegisterPostReq {
    @NotNull
    @NotBlank
    private String email;
    @NotNull
    @NotBlank
    private String password;
    @NotNull
    @NotBlank
    private String nickname;

    private List<Integer> instrumentIds;

    @Builder
    public UserRegisterPostReq(String email, String password, String nickname) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
    }

    public User toEntity() {
        return User.builder()
                .email(email)
                .password(password)
                .nickname(nickname)
                .build();
    }
}
