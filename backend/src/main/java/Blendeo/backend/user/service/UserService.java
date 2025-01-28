package Blendeo.backend.user.service;

import Blendeo.backend.user.dto.FollowerListRes;
import Blendeo.backend.user.dto.FollowingListRes;
import Blendeo.backend.user.dto.UserInfoGetRes;
import Blendeo.backend.user.dto.UserLoginPostReq;
import Blendeo.backend.user.dto.UserLoginPostRes;
import Blendeo.backend.user.dto.UserRegisterPostReq;
import Blendeo.backend.user.dto.UserUpdatePutReq;

public interface UserService {
    int register(UserRegisterPostReq userRegisterPostReq);

    void emailExist(String email);

    UserLoginPostRes login(UserLoginPostReq userRegisterPostReq);

    String findByAccessToken(String accessToken);

    void logout(String accessToken);

    UserInfoGetRes getUser(int id);

    void deleteUser(int id);

    void updateUser(UserUpdatePutReq userUpdatePutReq);

    void follow(int userId, int targetId);

    void unfollow(int userId, int targetId);

    FollowerListRes getFollowers(int userId);

    FollowingListRes getFollowings(int userId);
}
