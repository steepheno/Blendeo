package Blendeo.backend.user.service;

import Blendeo.backend.exception.EmailAlreadyExistsException;
import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.user.dto.*;
import Blendeo.backend.user.entity.RefreshToken;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.RefreshTokenRepository;
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
    private final RefreshTokenRepository refreshTokenRepository;

    public UserSeriveImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, RefreshTokenRepository refreshTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.refreshTokenRepository = refreshTokenRepository;
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
                throw new EntityNotFoundException("아이디 혹은 비밀번호가 일치하지 않습니다."); // 비밀번호 불일치
            }

            String accessToken = jwtUtil.generateAccessToken(user.get().getId());
            String refreshToken = jwtUtil.generateRefreshToken();

            userLoginPostRes = UserLoginPostRes.builder()
                    .id(user.get().getId())
                    .email(user.get().getEmail())
                    .nickname(user.get().getNickname())
                    .accessToken(accessToken).build();

            // Redis에 저장
            refreshTokenRepository.save(new RefreshToken(user.get().getId(), accessToken, refreshToken));

        } else {
            throw new EntityNotFoundException("아이디 혹은 비밀번호가 일치하지 않습니다.");
        }

        return userLoginPostRes;
    }

    @Override
    public void logout(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String accessToken = token.substring(7);

            if (!jwtUtil.validateToken(accessToken)) {
                throw new IllegalArgumentException("Invalid or expired access token");
            }

            int userId = jwtUtil.getIdFromToken(accessToken);

            Optional<RefreshToken> refreshToken = refreshTokenRepository.findById(String.valueOf(userId));

            refreshTokenRepository.delete(refreshToken.get());

//            SecurityContextHolder.clearContext(); // SecurityContext에서 인증 정보 제거
        }
    }

    @Override
    public UserInfoGetRes getUser(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(EntityNotFoundException::new);
        UserInfoGetRes info = new UserInfoGetRes(id, user.getEmail(), user.getNickname(), null);
        return info;
    }

    @Override
    public void deleteUser(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(EntityNotFoundException::new);
        userRepository.deleteById(id);
    }

    @Override
    public void updateUser(UserUpdatePutReq userUpdatePutReq) {
        User user = userRepository.findById(userUpdatePutReq.getId())
                        .orElseThrow(EntityNotFoundException::new);
        userRepository.updateUser(userUpdatePutReq.getId(), userUpdatePutReq.getNickname());
    }
}
