package Blendeo.backend.user.controller;

import Blendeo.backend.global.error.BaseException;
import Blendeo.backend.user.dto.UserInfoGetRes;
import Blendeo.backend.user.dto.UserLoginPostReq;
import Blendeo.backend.user.dto.UserRegisterPostReq;
import Blendeo.backend.user.dto.UserUpdatePutReq;
import Blendeo.backend.user.service.MailService;
import Blendeo.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.mail.MessagingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody UserRegisterPostReq userRegisterPostReq) {
        logger.info("UserRegisterPostReq: {}", userRegisterPostReq);
        int userId = userService.register(userRegisterPostReq);
        return ResponseEntity.ok().body(userId);
    }

    @Operation(summary="이메일 존재 유무 확인 / 인증번호 발송")
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
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginPostReq userLoginPostReq) {
        return ResponseEntity.ok().body(userService.login(userLoginPostReq));
    }

    @Operation(summary = "로그아웃")
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
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
}
