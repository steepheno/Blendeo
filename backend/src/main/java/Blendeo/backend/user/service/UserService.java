package Blendeo.backend.user.service;

import Blendeo.backend.user.dto.UserLoginPostReq;
import Blendeo.backend.user.dto.UserLoginPostRes;
import Blendeo.backend.user.dto.UserRegisterPostReq;

public interface UserService {
    int register(UserRegisterPostReq userRegisterPostReq);
    UserLoginPostRes login(UserLoginPostReq userRegisterPostReq);
}
