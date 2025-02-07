// src/types/api/user.ts
export interface User {
  id: number;
  email: string;
  nickname: string;
  profileImage: string | null;
}

export interface FollowResponse {
  followingIdList: number[];
  followingNicknameList: string[];
  followingCount: number;
  followerIdList: number[];
  followerNicknameList: string[];
  followerCount: number;
}

export interface UpdateUserRequest {
  nickname: string;
  profileImage?: string;
}
