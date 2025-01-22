package Blendeo.backend.user.service;

import Blendeo.backend.user.dto.*;

public interface UserService {
    int register(UserRegisterPostReq userRegisterPostReq);

    UserLoginPostRes login(UserLoginPostReq userRegisterPostReq);

    void logout(String accessToken);

    UserInfoGetRes getUser(int id);

    boolean deleteUser(int id);

    void updateUser(UserUpdatePutReq userUpdatePutReq);
}
