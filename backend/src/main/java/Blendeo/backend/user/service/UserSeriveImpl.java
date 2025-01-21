package Blendeo.backend.user.service;

import Blendeo.backend.user.dto.UserLoginPostReq;
import Blendeo.backend.user.dto.UserLoginPostRes;
import Blendeo.backend.user.dto.UserRegisterPostReq;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.TokenRepository;
import Blendeo.backend.user.repository.UserRepository;
import Blendeo.backend.user.util.JwtUtil;
import org.neo4j.driver.exceptions.DatabaseException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserSeriveImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final TokenRepository tokenRepository;

    public UserSeriveImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, TokenRepository tokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.tokenRepository = tokenRepository;
    }

    @Override
    public int register(UserRegisterPostReq userRegisterPostReq) {
        User user = userRegisterPostReq.toEntity();
        user.hashPassword(passwordEncoder);
        return userRepository.save(user).getId();
    }

    @Override
    public UserLoginPostRes login(UserLoginPostReq userLoginPostReq) {
        String email = userLoginPostReq.getEmail();
        User user = userRepository.findByEmail(email);
        UserLoginPostRes userLoginPostRes = new UserLoginPostRes();

        if (user != null) {
            if (user.checkPassword(userLoginPostReq.getPassword(), passwordEncoder)) {
                userLoginPostRes.setId(user.getId());
                userLoginPostRes.setEmail(user.getEmail());
                userLoginPostRes.setNickname(user.getNickname());
            } else {
                return null; // 비밀번호 불일치
            }

            String accessToken = jwtUtil.generateAccessToken(email);
            String refreshToken = jwtUtil.generateRefreshToken();

            userLoginPostRes.setAccessToken(accessToken);
            userLoginPostRes.setRefreshToken(refreshToken);

            // Redis에 저장
            tokenRepository.saveAccessToken("ACCESS:" + email, accessToken, 15 * 60 * 1000L); // 15분
            tokenRepository.saveRefreshToken("REFRESH:" + email, refreshToken, 7 * 24 * 60 * 60 * 1000L); // 7일

        } else {
            // 존재하지 않을 경우 Exception Handler 적용 필요!
            return null;
        }

        return userLoginPostRes;
    }

    @Override
    public void logout(String token) {
        tokenRepository.addToBlacklist(token);
    }
}
