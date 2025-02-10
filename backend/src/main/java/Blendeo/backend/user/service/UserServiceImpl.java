package Blendeo.backend.user.service;

import Blendeo.backend.exception.EmailAlreadyExistsException;
import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.notification.service.NotificationService;
import Blendeo.backend.global.util.S3Utils;
import Blendeo.backend.user.dto.*;
import Blendeo.backend.user.entity.Follow;
import Blendeo.backend.user.entity.Token;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.FollowRepository;
import Blendeo.backend.user.repository.RefreshTokenRepository;
import Blendeo.backend.user.repository.UserRepository;
import Blendeo.backend.user.util.JwtUtil;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;
    private final FollowService followService;
    private final FollowRepository followRepository;
    private final NotificationService notificationService;
    private final S3Utils s3Utils;

    @Override
    public int register(UserRegisterPostReq userRegisterPostReq) {

        // 이미 존재하는 이메일 예외 처리
        boolean emailExists = userRepository.existsByEmail(userRegisterPostReq.getEmail());

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
    public UserLoginPostResWithToken login(UserLoginPostReq userLoginPostReq) {
        String email = userLoginPostReq.getEmail();
        Optional<User> user = userRepository.findByEmail(email);
        UserLoginPostResWithToken userLoginPostResWithToken = null;

        if (user.isPresent()) {
            if (!user.get().checkPassword(userLoginPostReq.getPassword(), passwordEncoder)) {
                throw new EntityNotFoundException("아이디 혹은 비밀번호가 일치하지 않습니다."); // 비밀번호 불일치
            }

            String accessToken = jwtUtil.generateAccessToken(user.get().getId());
            String refreshToken = jwtUtil.generateRefreshToken();

            userLoginPostResWithToken = UserLoginPostResWithToken.builder()
                    .id(user.get().getId())
                    .email(user.get().getEmail())
                    .nickname(user.get().getNickname())
                    .accessToken(accessToken)
                    .refreshToken(refreshToken).build();

            // Redis에 저장
            refreshTokenRepository.save(new Token(user.get().getId(), accessToken, refreshToken));

            notificationService.createEmitter(user.get().getId());

        } else {
            throw new EntityNotFoundException("아이디 혹은 비밀번호가 일치하지 않습니다.");
        }

        return userLoginPostResWithToken;
    }

    @Override
    public String findByRefreshToken(String token) {
        Optional<Token> newToken = refreshTokenRepository.findByRefreshToken(token);

        if (newToken.isPresent() && jwtUtil.validateToken(newToken.get().getRefreshToken())) {
            Token resultToken = newToken.get();

            int id = jwtUtil.getIdFromToken(resultToken.getAccessToken());
            String newAccessToken = jwtUtil.generateAccessToken(id);

            resultToken.updateAccessToken(newAccessToken);
            refreshTokenRepository.save(resultToken);

            return newAccessToken;
        } else {
            throw new EntityNotFoundException("accessToken 만료되었습니다.");
        }
    }

    @Override
    public void logout(String token) {
        if (token != null) {
            if (!jwtUtil.validateToken(token)) {
                throw new IllegalArgumentException("Invalid or expired access token");
            }
            Optional<Token> tokenInfo = refreshTokenRepository.findByAccessToken(token);
            if (tokenInfo.isPresent()) {
                refreshTokenRepository.delete(tokenInfo.get());
            }
//            SecurityContextHolder.clearContext(); // SecurityContext에서 인증 정보 제거
        }
    }

    @Override
    public UserInfoGetRes getUser(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(EntityNotFoundException::new);

        UserInfoGetRes info = UserInfoGetRes.builder()
                .id(id).email(user.getEmail()).nickname(user.getNickname())
                .profileImage(user.getProfileImage()).build();
                
        return info;
    }

    @Override
    public void deleteUser(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(EntityNotFoundException::new);
        userRepository.deleteById(id);
    }

    @Override
    public void updateUser(int userId, String nickname, MultipartFile profileImage) {
        User user = userRepository.findById(userId)
                .orElseThrow(EntityNotFoundException::new);

        // user 에 원래 존재했던 프로필 사진을 S3에서 삭제하기.
        if (user.getProfileImage()!=null) {
            s3Utils.deleteFromS3ByUrl(user.getProfileImage().toString());
        }

        // 들어온 사진이 없다면, URL null로 저장.
        URL profileImgUrl = null;

        if (profileImage != null && !profileImage.isEmpty()) {
            File tempFile = null;


            try {
                String fileName = "profile/image_"+ UUID.randomUUID().toString();
                tempFile = File.createTempFile(fileName, ".jpeg");

                profileImage.transferTo(tempFile);

                s3Utils.uploadToS3(tempFile, fileName + ".jpeg", "profileImage/jpeg");

                String urlString = s3Utils.getUrlByFileName(fileName + ".jpeg");
                profileImgUrl = new URL(urlString);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        userRepository.updateUser(userId, nickname, profileImgUrl);
    }

    @Transactional
    @Override
    public void follow(int userId, int targetId) {
        User follower = userRepository.findById(userId)
                .orElseThrow(EntityNotFoundException::new);
        User followee = userRepository.findById(targetId)
                .orElseThrow(EntityNotFoundException::new);
        followService.follow(follower, followee);
    }

    @Transactional
    @Override
    public void unfollow(int userId, int targetId) {
        User follower = userRepository.findById(userId)
                .orElseThrow(EntityNotFoundException::new);
        User followee = userRepository.findById(targetId)
                .orElseThrow(EntityNotFoundException::new);
        followService.unfollow(follower, followee);
    }

    @Transactional(readOnly = true)
    @Override
    public FollowerListRes getFollowers(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(EntityNotFoundException::new);

        List<Follow> followerList = followRepository.findAllByFollowPK_Following(user);

        List<User> followerUserList = followerList.stream()
                .map(Follow::getFollower)
                .toList();

        List<Integer> followerIdList = followerUserList.stream()
                .map(User::getId)
                .toList();

        List<String> followerNicknameList = followerUserList.stream()
                .map(User::getNickname)
                .toList();

        int followerCount = followerList.size();

        return FollowerListRes.builder()
                .followerIdList(followerIdList)
                .followerNicknameList(followerNicknameList)
                .followerCount(followerCount)
                .build();
    }

    @Transactional(readOnly = true)
    @Override
    public FollowingListRes getFollowings(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(EntityNotFoundException::new);

        List<Follow> followingList = followRepository.findAllByFollowPK_Follower(user);

        List<User> followingUserList = followingList.stream()
                .map(Follow::getFollowing)
                .toList();

        List<Integer> followingIdList = followingUserList.stream()
                .map(User::getId)
                .toList();

        List<String> followingNicknameList = followingUserList.stream()
                .map(User::getNickname)
                .toList();

        int followingCount = followingList.size();

        return FollowingListRes.builder()
                .followingIdList(followingIdList)
                .followingNicknameList(followingNicknameList)
                .followingCount(followingCount)
                .build();
    }
}
