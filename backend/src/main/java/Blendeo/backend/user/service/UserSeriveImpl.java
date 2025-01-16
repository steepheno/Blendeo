package Blendeo.backend.user.service;

import Blendeo.backend.user.dto.UserRegisterPostReq;
import Blendeo.backend.user.entity.User;
import Blendeo.backend.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserSeriveImpl implements UserService {
    public final UserRepository userRepository;

    public UserSeriveImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public int register(UserRegisterPostReq userRegisterPostReq) {
        return userRepository.save(userRegisterPostReq.toEntity()).getId();
    }
}
