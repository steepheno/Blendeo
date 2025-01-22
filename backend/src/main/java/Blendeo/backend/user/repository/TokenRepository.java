package Blendeo.backend.user.repository;

import Blendeo.backend.user.util.JwtUtil;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.concurrent.TimeUnit;

@Repository
public class TokenRepository {
    private final RedisTemplate<String, String> redisTemplate;
    private final JwtUtil jwtUtil;

    public TokenRepository(RedisTemplate<String, String> redisTemplate, JwtUtil jwtUtil) {
        this.redisTemplate = redisTemplate;
        this.jwtUtil = jwtUtil;
    }

    public void saveAccessToken(String key, String token, long duration) {
        redisTemplate.opsForValue().set(key, token, duration, TimeUnit.MILLISECONDS);
    }

    public void saveRefreshToken(String key, String token, long duration) {
        redisTemplate.opsForValue().set(key, token, duration, TimeUnit.MILLISECONDS);
    }

    // 토큰을 Blacklist에 추가
    public void addToBlacklist(String token) {
        redisTemplate.opsForValue().set("Blacklist: "+token, "logged_out", 1000L * 60 * 15, TimeUnit.MILLISECONDS);
    }

    // 토큰이 Blacklist에 존재하는지 확인
    public boolean isBlacklisted(String token) {
        return redisTemplate.hasKey("Blacklist: "+token); // Redis에서 토큰 ID 확인
    }

    public String getToken(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public void deleteToken(String key) {
        redisTemplate.delete(key);
    }

    public void invalidateRefreshToken(String refreshToken) {
        // Refresh Token 삭제
        String key = "refreshToken:" + refreshToken;
        redisTemplate.delete(key);
    }
}
