package Blendeo.backend.user.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter //
public class User {
    @Id // 해당 변수가 PK 임.
    @GeneratedValue(strategy= GenerationType.IDENTITY) // 자동생성 : auto_increment의 역할
    private int id;
    @Column
    private String email;
    @Column
    private String password;
    @Column
    private String nickname;

    public User() {

    }
    @Builder
    User(int id, String email, String password, String nickname) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.nickname = nickname;
    }
}
