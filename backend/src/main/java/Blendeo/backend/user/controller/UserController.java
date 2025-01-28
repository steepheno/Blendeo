package Blendeo.backend.user.controller;

import Blendeo.backend.user.dto.FollowerListRes;
import Blendeo.backend.user.dto.FollowingListRes;
import Blendeo.backend.user.dto.UserInfoGetRes;
import Blendeo.backend.user.dto.UserLoginPostReq;
import Blendeo.backend.user.dto.UserRegisterPostReq;
import Blendeo.backend.user.dto.UserUpdatePutReq;
import Blendeo.backend.user.entity.RefreshToken;
import Blendeo.backend.user.service.MailService;
import Blendeo.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.mail.MessagingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/v1/user")
@RestController
public class UserController {
    // log
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final UserService userService;
    private final MailService mailService;


    public UserController(UserService userService, MailService mailService) {
        this.userService = userService;
        this.mailService = mailService;
    }

    @Operation(summary = "회원가입")
    @PostMapping("/auth/signup")
    public ResponseEntity<?> register(@RequestBody UserRegisterPostReq userRegisterPostReq) {
        logger.info("UserRegisterPostReq: {}", userRegisterPostReq);
        int userId = userService.register(userRegisterPostReq);
        return ResponseEntity.ok().body(userId);
    }

    @Operation(summary = "이메일 존재 유무 확인 / 인증번호 발송")
    @PostMapping("/mail/check")
    public ResponseEntity<?> MailSend(@RequestParam String email) {
        String authCode = null;
        userService.emailExist(email);
        try {
            authCode = mailService.sendMail(email);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok().body(authCode);
    }

    @Operation(summary = "로그인")
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody UserLoginPostReq userLoginPostReq) {
        return ResponseEntity.ok().body(userService.login(userLoginPostReq));
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
    public ResponseEntity<?> getUser(@PathVariable int id) {
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
    public ResponseEntity<?> deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "팔로우")
    @PostMapping("/following/{targetId}")
    public ResponseEntity<?> follow(@PathVariable int targetId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String strUserId = user.getUsername();
        int userId = Integer.parseInt(strUserId);
        userService.follow(userId, targetId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "언팔로우")
    @DeleteMapping("/following/{targetId}")
    public ResponseEntity<?> unfollow(@PathVariable int targetId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String strUserId = user.getUsername();
        int userId = Integer.parseInt(strUserId);
        userService.unfollow(userId, targetId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "유저의 팔로우 목록 조회")
    @GetMapping("/get-followings/{userId}")
    public ResponseEntity<FollowingListRes> getFollowings(@PathVariable int userId) {
        FollowingListRes followingList = userService.getFollowings(userId);
        return ResponseEntity.ok().body(followingList);
    }

    @Operation(summary = "유저의 팔로워 목록 조회")
    @GetMapping("/get-followers/{userId}")
    public ResponseEntity<FollowerListRes> getFollowers(@PathVariable int userId) {
        FollowerListRes followerList = userService.getFollowers(userId);
        return ResponseEntity.ok().body(followerList);
    }

}
