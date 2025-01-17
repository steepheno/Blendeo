package Blendeo.backend.user.service;

import Blendeo.backend.user.dto.UserRegisterPostReq;

public interface UserService {
    public int register(UserRegisterPostReq userRegisterPostReq);

}
