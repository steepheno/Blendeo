package Blendeo.backend.user.controller;

import Blendeo.backend.user.dto.UserRegisterPostReq;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/users")
@RestController
public class UserController {
    // log
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegisterPostReq userRegisterPostReq) {
        logger.info("UserRegisterPostReq: {}", userRegisterPostReq);
        return ResponseEntity.ok().body(userService.register(userRegisterPostReq));
    }
}
