package Blendeo.backend.user.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.crypto.password.PasswordEncoder;

@Entity
@Getter
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

    /**
     * 비밀번호 암호화
     */
    public User hashPassword(PasswordEncoder passwordEncoder) {
        this.password = passwordEncoder.encode(this.password);
        return this;
    }

    /**
     * 비밀번호 확인
     */
    public boolean checkPassword(String plainPassword, PasswordEncoder passwordEncoder) {
        return passwordEncoder.matches(plainPassword, this.password);
    }
}
