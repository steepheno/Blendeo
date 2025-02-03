package Blendeo.backend.user.controller;

import Blendeo.backend.user.dto.*;
import Blendeo.backend.user.entity.RefreshToken;
import Blendeo.backend.user.service.MailService;
import Blendeo.backend.user.service.UserService;
import com.google.common.net.HttpHeaders;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/v1/user")
@RestController
@Slf4j
public class UserController {

    private final UserService userService;
    private final MailService mailService;


    public UserController(UserService userService, MailService mailService) {
        this.userService = userService;
        this.mailService = mailService;
    }

    @Operation(summary = "회원가입")
    @PostMapping("/auth/signup")
    public ResponseEntity<?> register(@RequestBody UserRegisterPostReq userRegisterPostReq) {
        log.info("UserRegisterPostReq: {}", userRegisterPostReq);
        int userId = userService.register(userRegisterPostReq);
        return ResponseEntity.ok().body(userId);
    }

    @Operation(summary = "이메일 존재 유무 확인 / 인증번호 발송")
    @PostMapping("/auth/mail/check")
    public ResponseEntity<?> MailSend(@RequestParam("email") String email) {
        String authCode = null;
        log.warn("컨트롤러 시작");
        userService.emailExist(email);
        try {
            log.warn("mail 서비스 시작");
            authCode = mailService.sendMail(email);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok().body(authCode);
    }

    @Operation(summary = "로그인")
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody UserLoginPostReq userLoginPostReq, HttpServletResponse response) {
        UserLoginPostResWithToken userLoginPostResWithToken = userService.login(userLoginPostReq);
        UserLoginPostRes userLoginPostRes = UserLoginPostRes.builder()
                .id(userLoginPostResWithToken.getId())
                .email(userLoginPostResWithToken.getEmail())
                .nickname(userLoginPostResWithToken.getNickname())
                .profileImage(userLoginPostResWithToken.getProfileImage()).build();

        Cookie accessTokenCookie = new Cookie("AccessToken", userLoginPostResWithToken.getAccessToken());
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setSecure(true);
        accessTokenCookie.setPath("/");
        Cookie refreshTokenCookie = new Cookie("RefreshToken", userLoginPostResWithToken.getRefreshToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        response.addCookie(accessTokenCookie);
        response.addCookie(refreshTokenCookie);
        return ResponseEntity.ok().body(userLoginPostRes);
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<?> refresh(@RequestHeader("Authorization") final String token) {
        return ResponseEntity.ok().body(userService.findByAccessToken(token));
    }

    @Operation(summary = "로그아웃")
    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") final String token) {
        userService.logout(token);
        return ResponseEntity.ok().body("로그아웃 되었습니다");
    }

    @Operation(summary = "회원정보 단일건 조회")
    @GetMapping("/get-user/{id}")
    public ResponseEntity<?> getUser(@PathVariable("id") int id) {
        UserInfoGetRes user = userService.getUser(id);
        return ResponseEntity.ok().body(user);
    }

    // 전체 조회?

    @Operation(summary = "회원정보 수정")
    @PutMapping("/update-user")
    public ResponseEntity<?> updateUser(@RequestBody UserUpdatePutReq userUpdatePutReq) {
        userService.updateUser(userUpdatePutReq);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "회원 탈퇴")
    @DeleteMapping("/delete-user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") int id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "팔로우")
    @PostMapping("/following/{targetId}")
    public ResponseEntity<?> follow(@PathVariable("targetId") int targetId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String strUserId = user.getUsername();
        int userId = Integer.parseInt(strUserId);
        userService.follow(userId, targetId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "언팔로우")
    @DeleteMapping("/following/{targetId}")
    public ResponseEntity<?> unfollow(@PathVariable("targetId") int targetId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String strUserId = user.getUsername();
        int userId = Integer.parseInt(strUserId);
        userService.unfollow(userId, targetId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "유저의 팔로우 목록 조회")
    @GetMapping("/get-followings/{userId}")
    public ResponseEntity<FollowingListRes> getFollowings(@PathVariable("userId") int userId) {
        FollowingListRes followingList = userService.getFollowings(userId);
        return ResponseEntity.ok().body(followingList);
    }

    @Operation(summary = "유저의 팔로워 목록 조회")
    @GetMapping("/get-followers/{userId}")
    public ResponseEntity<FollowerListRes> getFollowers(@PathVariable("userId") int userId) {
        FollowerListRes followerList = userService.getFollowers(userId);
        return ResponseEntity.ok().body(followerList);
    }

}
