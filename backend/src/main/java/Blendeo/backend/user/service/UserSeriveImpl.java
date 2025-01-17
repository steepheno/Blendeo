package Blendeo.backend.user.service;

import Blendeo.backend.user.dto.UserLoginPostReq;
import Blendeo.backend.user.dto.UserLoginPostRes;
import Blendeo.backend.user.dto.UserRegisterPostReq;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.UserRepository;
import org.neo4j.driver.exceptions.DatabaseException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserSeriveImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserSeriveImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public int register(UserRegisterPostReq userRegisterPostReq) {
        User user = userRegisterPostReq.toEntity();
        user.hashPassword(passwordEncoder);
        return userRepository.save(user).getId();
    }

    @Override
    public UserLoginPostRes login(UserLoginPostReq userLoginPostReq) {
        User user = userRepository.findByEmail(userLoginPostReq.getEmail());
        UserLoginPostRes userLoginPostRes = new UserLoginPostRes();

        if (user != null) {
            if (user.checkPassword(userLoginPostReq.getPassword(), passwordEncoder)) {
                userLoginPostRes.setId(user.getId());
                userLoginPostRes.setEmail(user.getId());
                userLoginPostRes.setNickname(user.getNickname());
            }
        } else {
            // 존재하지 않을 경우 Exception Handler 적용 필요!
            return null;
        }

        return userLoginPostRes;
    }
}
