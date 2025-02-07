package Blendeo.backend.user.entity;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.io.Serializable;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@RedisHash(value="Token", timeToLive=60 * 60 * 24 * 7) // 14 일
public class Token implements Serializable {
    @Id
    private int id;
    @Indexed // 보조 인덱스, 해당 필드로 검색, 삭제 가능
    private String accessToken;
    @Indexed
    private String refreshToken;

    public void updateAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }


}
