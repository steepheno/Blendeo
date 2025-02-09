import axiosInstance from "@/api/axios";
import { User, FollowResponse } from "@/types/api/user";

// 프로필 관련
export const updateProfile = async (data: {
  nickname: string;
  profileImage?: File;
}) => {
  const formData = new FormData();
  formData.append("nickname", data.nickname);

  if (data.profileImage) {
    formData.append("profileImage", data.profileImage);
  }

  return axiosInstance.put<User>("/user/update-user", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getUser = async (id: number) => {
  return axiosInstance.get<User>(`/user/get-user/${id}`);
};

export const deleteUser = async (userId: number) => {
  return axiosInstance.delete<void>(`/user/delete-user/${userId}`);
};

// 팔로우 관련
export const followUser = async (userId: number) => {
  return axiosInstance.post<void>(`/user/following/${userId}`);
};

export const unfollowUser = async (userId: number) => {
  return axiosInstance.delete<void>(`/user/following/${userId}`);
};

export const getFollowings = async (userId: number) => {
  return axiosInstance.get<FollowResponse>(`/user/get-followings/${userId}`);
};

export const getFollowers = async (userId: number) => {
  return axiosInstance.get<FollowResponse>(`/user/get-followers/${userId}`);
};
