package Blendeo.backend.user.service;

import Blendeo.backend.exception.EmailAlreadyExistsException;
import Blendeo.backend.global.error.BaseException;
import Blendeo.backend.global.error.ErrorCode;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.user.dto.*;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.TokenRepository;
import Blendeo.backend.user.repository.UserRepository;
import Blendeo.backend.user.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

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

        // 이미 존재하는 이메일 예외 처리
        boolean emailExists =  userRepository.existsByEmail(userRegisterPostReq.getEmail());

        if (emailExists) {
            throw new EmailAlreadyExistsException();
        }
        User user = userRegisterPostReq.toEntity();
        user.hashPassword(passwordEncoder);
        return userRepository.save(user).getId();
    }

    @Override
    public void emailExist(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException();
        }
    }

    @Override
    public UserLoginPostRes login(UserLoginPostReq userLoginPostReq) {
        String email = userLoginPostReq.getEmail();
        Optional<User> user = userRepository.findByEmail(email);
        UserLoginPostRes userLoginPostRes;

        if (user.isPresent()) {
            if (!user.get().checkPassword(userLoginPostReq.getPassword(), passwordEncoder)) {
                return null; // 비밀번호 불일치
            }

            String accessToken = jwtUtil.generateAccessToken(email);
            String refreshToken = jwtUtil.generateRefreshToken();

            userLoginPostRes = UserLoginPostRes.builder()
                    .id(user.get().getId())
                    .email(user.get().getEmail())
                    .nickname(user.get().getNickname())
                    .accessToken(accessToken)
                    .refreshToken(refreshToken).build();

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
