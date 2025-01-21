package Blendeo.backend.user.repository;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.concurrent.TimeUnit;

@Repository
public class TokenRepository {
    private final RedisTemplate<String, String> redisTemplate;

    public TokenRepository(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void saveAccessToken(String key, String token, long duration) {
        redisTemplate.opsForValue().set(key, token, duration, TimeUnit.MILLISECONDS);
    }

    public void saveRefreshToken(String key, String token, long duration) {
        redisTemplate.opsForValue().set(key, token, duration, TimeUnit.MILLISECONDS);
    }

    public String getToken(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public void deleteToken(String key) {
        redisTemplate.delete(key);
    }
}
