package Blendeo.backend.user.controller;

import Blendeo.backend.user.dto.UserRegisterPostReq;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/v1/user")
@RestController
public class UserController {
    // log
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody UserRegisterPostReq userRegisterPostReq) {
        logger.info("UserRegisterPostReq: {}", userRegisterPostReq);
        return ResponseEntity.ok().body(userService.register(userRegisterPostReq));
    }

//    @GetMapping("/login")
//    public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password) {
//
//        return ResponseEntity.ok().body(userService.login(username, password));
//    }

}
