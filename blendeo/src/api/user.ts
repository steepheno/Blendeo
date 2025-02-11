import axiosInstance from "@/api/axios";
import { User, FollowResponse } from "@/types/api/user";

interface UpdateProfileRequest {
  nickname?: string;
  intro?: string;
  profileImage?: File | null;
  header?: File | null;
}

export const updateProfile = async (data: UpdateProfileRequest): Promise<User> => {
  const formData = new FormData();
  
  if (data.nickname) formData.append('nickname', data.nickname);
  if (data.intro) formData.append('intro', data.intro);
  if (data.profileImage) formData.append('profileImage', data.profileImage);
  if (data.header) formData.append('header', data.header);

  try {
    const response = await axiosInstance.put<User>('/user/update-user', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response;
  } catch (error) {
    throw new Error('프로필 업데이트에 실패했습니다.'+error);
  }
};

export const getUser = async (id: number): Promise<User> => {
  try {
    const response = await axiosInstance.get<User>(`/user/get-user/${id}`);
    return response;
  } catch (error) {
    throw new Error('사용자 정보를 불러오는데 실패했습니다.'+error);
  }
};

export const deleteUser = async (userId: number): Promise<void> => {
  try {
    await axiosInstance.delete<void>(`/user/delete-user/${userId}`);
  } catch (error) {
    throw new Error('사용자 삭제에 실패했습니다.'+error);
  }
};

// 팔로우 관련
export const followUser = async (userId: number): Promise<void> => {
  try {
    await axiosInstance.post<void>(`/user/following/${userId}`);
  } catch (error) {
    throw new Error('팔로우에 실패했습니다.'+error);
  }
};

export const unfollowUser = async (userId: number): Promise<void> => {
  try {
    await axiosInstance.delete<void>(`/user/following/${userId}`);
  } catch (error) {
    throw new Error('언팔로우에 실패했습니다.'+error);
  }
};

export const getFollowings = async (userId: number): Promise<FollowResponse> => {
  try {
    const response = await axiosInstance.get<FollowResponse>(`/user/get-followings/${userId}`);
    return response;
  } catch (error) {
    throw new Error('팔로잉 목록을 불러오는데 실패했습니다.'+error);
  }
};

export const getFollowers = async (userId: number): Promise<FollowResponse> => {
  try {
    const response = await axiosInstance.get<FollowResponse>(`/user/get-followers/${userId}`);
    
    return response;
  } catch (error) {
    throw new Error('팔로워 목록을 불러오는데 실패했습니다.'+error);
  }
};