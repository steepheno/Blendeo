package Blendeo.backend.user.service;

import Blendeo.backend.user.dto.*;

public interface UserService {
    int register(UserRegisterPostReq userRegisterPostReq);

    void emailExist(String email);

    UserLoginPostResWithToken login(UserLoginPostReq userRegisterPostReq);

    String findByRefreshToken(String accessToken);

    void logout(String accessToken);

    UserInfoGetRes getUser(int id);

    void deleteUser(int id);

    void updateUser(UserUpdatePutReq userUpdatePutReq);

    void follow(int userId, int targetId);

    void unfollow(int userId, int targetId);

    FollowerListRes getFollowers(int userId);

    FollowingListRes getFollowings(int userId);
}
