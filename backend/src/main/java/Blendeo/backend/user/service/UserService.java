package Blendeo.backend.user.service;

import Blendeo.backend.user.dto.*;
import Blendeo.backend.user.entity.RefreshToken;

public interface UserService {
    int register(UserRegisterPostReq userRegisterPostReq);

    void emailExist(String email);

    UserLoginPostRes login(UserLoginPostReq userRegisterPostReq);

    String findByAccessToken(String accessToken);

    void logout(String accessToken);

    UserInfoGetRes getUser(int id);

    void deleteUser(int id);

    void updateUser(UserUpdatePutReq userUpdatePutReq);
}
