package Blendeo.backend.user.controller;

import Blendeo.backend.user.dto.*;
import Blendeo.backend.user.service.MailService;
import Blendeo.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpResponse;

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

    @Operation(summary = "[STEP1] : 이메일 존재 유무 확인 / 인증번호 발송")
    @PostMapping("/auth/mail/check")
    public ResponseEntity<?> MailSend(@RequestParam("email") String email) {
        String authCode = null;
        log.warn("컨트롤러 시작");
        userService.emailExist(email);
        try {
            log.warn("mail 서비스 시작");
            authCode = mailService.sendMail(email);
            log.info(authCode);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok().body("인증번호가 발급되었습니다.");
    }

    @Operation(summary = "[STEP2] : 이메일 존재 유무 확인 / 인증번호 일치 확인")
    @PostMapping("/auth/auth/code/check")
    public ResponseEntity<?> authCodeCheck(@RequestParam("email") String email, @RequestParam("authCode") String authCode) {
        userService.emailExist(email);
        log.warn("mail 서비스 시작");
        if (mailService.checkAuthCode(email, authCode)) {
            return ResponseEntity.ok().body("인증번호가 일치합니다.");
        }
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).build();
    }

    @Operation(summary = "로그인",
    description = "쿠키에 만료시간 포함하여 accessToken, refreshToken 반환. (swagger에서 쉽게 확인하기 위해 response에도 값 추가함.)")
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody UserLoginPostReq userLoginPostReq, HttpServletResponse response) {
        UserLoginPostResWithToken userLoginPostResWithToken = userService.login(userLoginPostReq);
        UserLoginPostRes userLoginPostRes = UserLoginPostRes.builder()
                .id(userLoginPostResWithToken.getId())
                .email(userLoginPostResWithToken.getEmail())
                .nickname(userLoginPostResWithToken.getNickname())
                .profileImage(userLoginPostResWithToken.getProfileImage())
                .accessToken(userLoginPostResWithToken.getAccessToken())
                .refreshToken(userLoginPostResWithToken.getRefreshToken()).build();

        Cookie accessTokenCookie = new Cookie("AccessToken", userLoginPostResWithToken.getAccessToken());
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setSecure(true);
        accessTokenCookie.setPath("/api/v1/user/auth");
        accessTokenCookie.setMaxAge(15 * 60); // 15분
        Cookie refreshTokenCookie = new Cookie("RefreshToken", userLoginPostResWithToken.getRefreshToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/api/v1/user/auth");
        refreshTokenCookie.setMaxAge(60 * 60 * 24 * 7); // 7일

        response.addCookie(accessTokenCookie);
        response.addCookie(refreshTokenCookie);

        return ResponseEntity.ok().body(userLoginPostRes);
    }

    @Operation(summary = "refreshToken으로 accessToken 갱신",
        description = "Bearer + refreshToken 보내기, [반환값] 새로 갱신된 accessToken 반환")
    @PostMapping("/auth/refresh")
    public ResponseEntity<?> refresh(@RequestHeader("Authorization") final String Authorization) {
        log.warn(Authorization);

        String newAccessToken = userService.findByRefreshToken(Authorization);
        ResponseCookie accessTokenCookie = ResponseCookie.from("AccessToken", newAccessToken)
                .httpOnly(true)
                .secure(true)
                .path("/api/v1/user/auth")
                .maxAge(60 * 15) // 15분
                .sameSite("Strict")
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
                .body("accessToken이 재생되었습니다.");
    }

    @Operation(summary = "로그아웃", description = "accessToken, refreshToken 제거됩니다.")
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
