package Blendeo.backend.user.controller;

import Blendeo.backend.user.dto.UserInfoGetRes;
import Blendeo.backend.user.dto.UserLoginPostReq;
import Blendeo.backend.user.dto.UserRegisterPostReq;
import Blendeo.backend.user.dto.UserUpdatePutReq;
import Blendeo.backend.user.service.UserService;
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

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody UserRegisterPostReq userRegisterPostReq) {
        logger.info("UserRegisterPostReq: {}", userRegisterPostReq);
        return ResponseEntity.ok().body(userService.register(userRegisterPostReq));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginPostReq userLoginPostReq) {
        return ResponseEntity.ok().body(userService.login(userLoginPostReq));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
        userService.logout(token);
        return ResponseEntity.ok().body("로그아웃 되었습니다");
    }

    @GetMapping("/get-user/{id}")
    public ResponseEntity<?> getUser(@PathVariable int id) {
        UserInfoGetRes user = userService.getUser(id);
        return ResponseEntity.ok().body(user);
    }

    // 전체 조회?

    @PutMapping("/update-user")
    public ResponseEntity<?> updateUser(@RequestBody UserUpdatePutReq userUpdatePutReq) {
        userService.updateUser(userUpdatePutReq);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete-user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id) {
        boolean result = userService.deleteUser(id);
        if (result) {
            return ResponseEntity.ok().build();
        } else {
            return new ResponseEntity<>(ResponseEntity.status(HttpStatus.NOT_FOUND).build(), HttpStatus.NOT_FOUND);
        }
    }
}
