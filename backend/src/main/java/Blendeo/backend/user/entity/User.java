package Blendeo.backend.user.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.crypto.password.PasswordEncoder;

@Entity
@Getter
public class User {
    @Id // 해당 변수가 PK 임.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동생성 : auto_increment의 역할
    private int id;
    @Column
    private String email;
    @Column
    private String password;
    @Column
    private String nickname;
    @Column
    private URL header;
    @Column
    private String intro;
    @Column
    private URL profileImage;

    @OneToMany(mappedBy = "followPK.follower", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Follow> followers = new ArrayList<>();

    @OneToMany(mappedBy = "followPK.following", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Follow> followings = new ArrayList<>();


    public User() {
    }

    @Builder
    User(int id, String email, String password, String nickname, URL header, String intro, URL profileImage) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.header = header;
        this.intro = intro;
        this.profileImage = profileImage;
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
