package Blendeo.backend.user.service;

import Blendeo.backend.exception.EmailAlreadyExistsException;
import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.notification.service.NotificationService;
import Blendeo.backend.user.dto.FollowerListRes;
import Blendeo.backend.user.dto.FollowingListRes;
import Blendeo.backend.user.dto.UserInfoGetRes;
import Blendeo.backend.user.dto.UserLoginPostReq;
import Blendeo.backend.user.dto.UserLoginPostRes;
import Blendeo.backend.user.dto.UserRegisterPostReq;
import Blendeo.backend.user.dto.UserUpdatePutReq;
import Blendeo.backend.user.entity.Follow;
import Blendeo.backend.user.entity.RefreshToken;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.FollowRepository;
import Blendeo.backend.user.repository.RefreshTokenRepository;
import Blendeo.backend.user.repository.UserRepository;
import Blendeo.backend.user.util.JwtUtil;
import java.util.List;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;
    private final FollowService followService;
    private final FollowRepository followRepository;
    private final NotificationService notificationService;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil,
                           RefreshTokenRepository refreshTokenRepository, FollowService followService,
                           FollowRepository followRepository, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.refreshTokenRepository = refreshTokenRepository;
        this.followService = followService;
        this.followRepository = followRepository;
        this.notificationService = notificationService;
    }

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

            notificationService.createEmitter(user.get().getId());

        } else {
            throw new EntityNotFoundException("아이디 혹은 비밀번호가 일치하지 않습니다.");
        }

        return userLoginPostRes;
    }

    @Override
    public String findByAccessToken(String token) {
        if (!token.startsWith("Bearer ")) {
            throw new IllegalArgumentException();
        }
        String accessToken = token.substring(7);
        Optional<RefreshToken> refreshToken = refreshTokenRepository.findByAccessToken(accessToken);

        if (refreshToken.isPresent() && jwtUtil.validateToken(refreshToken.get().getRefreshToken())) {
            RefreshToken resultToken = refreshToken.get();

            String newAccessToken = jwtUtil.generateAccessToken(resultToken.getId());

            resultToken.updateAccessToken(newAccessToken);
            refreshTokenRepository.save(resultToken);

            return newAccessToken;
        } else {
            throw new EntityNotFoundException("accessToken 만료되었습니다.");
        }
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
