package Blendeo.backend.user.service;

import Blendeo.backend.user.dto.*;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.TokenRepository;
import Blendeo.backend.user.repository.UserRepository;
import Blendeo.backend.user.util.JwtUtil;
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
        if (token != null && token.startsWith("Bearer ")) {
            String accessToken = token.substring(7);
            tokenRepository.addToBlacklist(accessToken);
        }
    }

    @Override
    public UserInfoGetRes getUser(int id) {
        User user = userRepository.findById(id).get();
        UserInfoGetRes info = new UserInfoGetRes(id, user.getEmail(), user.getNickname(), null);
        return info;
    }

    @Override
    public boolean deleteUser(int id) {
        boolean isExists = userRepository.existsById(id);
        if (isExists) {
            userRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public void updateUser(UserUpdatePutReq userUpdatePutReq) {
        userRepository.updateUser(userUpdatePutReq.getId(), userUpdatePutReq.getNickname());
    }
}
