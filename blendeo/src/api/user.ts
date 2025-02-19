import axiosInstance from "@/api/axios";
import { User, FollowResponse } from "@/types/api/user";

interface UpdateProfileRequest {
  nickname?: string;
  intro?: string;
  profileImage?: File | null;
  header?: File | null;
}

export default interface FollowingProjectResponse {
  projectId: number;
  title: string;
  thumbnail: string;
  viewCnt: number;
  contributionCnt: number;
  duration: number;
  authorId: number;
  authorName: string;
  authorNickname: string;
  authorProfileImage: string;
  instruments: Array<string>;
  createdAt: string;
}

export const updateProfile = async (
  data: UpdateProfileRequest
): Promise<User> => {
  const formData = new FormData();

  if (data.nickname) formData.append("nickname", data.nickname);
  if (data.intro) formData.append("intro", data.intro);
  if (data.profileImage) formData.append("profileImage", data.profileImage);
  if (data.header) formData.append("header", data.header);

  try {
    const response = await axiosInstance.put<User>(
      "/user/update-user",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error) {
    throw new Error("프로필 업데이트에 실패했습니다." + error);
  }
};

export const getUser = async (id: number): Promise<User> => {
  try {
    const response = await axiosInstance.get<User>(`/user/get-user/${id}`);
    return response;
  } catch (error) {
    throw new Error("사용자 정보를 불러오는데 실패했습니다." + error);
  }
};

export const deleteUser = async (userId: number): Promise<void> => {
  try {
    await axiosInstance.delete<void>(`/user/delete-user/${userId}`);
  } catch (error) {
    throw new Error("사용자 삭제에 실패했습니다." + error);
  }
};

// 팔로우 관련
export const followUser = async (userId: number): Promise<void> => {
  try {
    await axiosInstance.post<void>(`/user/following/${userId}`);
  } catch (error) {
    throw new Error("팔로우에 실패했습니다." + error);
  }
};

export const unfollowUser = async (userId: number): Promise<void> => {
  try {
    await axiosInstance.delete<void>(`/user/following/${userId}`);
  } catch (error) {
    throw new Error("언팔로우에 실패했습니다." + error);
  }
};

export const getFollowings = async (
  userId: number
): Promise<FollowResponse> => {
  try {
    const response = await axiosInstance.get<FollowResponse>(
      `/user/follow/get-followings/${userId}`
    );
    return response;
  } catch (error) {
    throw new Error("팔로잉 목록을 불러오는데 실패했습니다." + error);
  }
};

export const getFollowers = async (userId: number): Promise<FollowResponse> => {
  try {
    const response = await axiosInstance.get<FollowResponse>(
      `/user/follow/get-followers/${userId}`
    );

    return response;
  } catch (error) {
    throw new Error("팔로워 목록을 불러오는데 실패했습니다." + error);
  }
};

export const checkFollowing = async (
  targetUserId: number
): Promise<boolean> => {
  // axiosInstance가 알아서 토큰 처리와 refresh를 해주므로
  // 단순히 API 호출만 하면 됩니다
  try {
    const response = await axiosInstance.get<boolean>(
      `/user/checkFollowing/${targetUserId}`
    );
    return response;
  } catch (error) {
    // 401, 403 등의 인증 에러는 axiosInstance에서 처리됨
    // 그 외의 에러는 false 리턴
    if (error) return false;
    return false;
  }
};

export const getFollowingProjects = async (): Promise<
  Array<FollowingProjectResponse>
> => {
  try {
    const data = await axiosInstance.get<Array<FollowingProjectResponse>>(
      `/project/follow?page=0&size=2`
    );
    return data;
  } catch (error) {
    console.error("API 에러:", error);
    return [];
  }
};
