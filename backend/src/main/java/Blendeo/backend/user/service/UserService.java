package Blendeo.backend.user.service;

import Blendeo.backend.user.dto.UserRegisterPostReq;
import Blendeo.backend.user.entity.User;

public interface UserService {
    public int register(UserRegisterPostReq userRegisterPostReq);
}
