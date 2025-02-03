package Blendeo.backend.user.entity;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.io.Serializable;

@Getter
@AllArgsConstructor
@RedisHash(value="Token", timeToLive=60 * 60 * 24 * 14) // 14 일
public class Token implements Serializable {
    @Id
    private int id;

    private String accessToken;
    @Indexed
    private String refreshToken;

    public void updateAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }


}
