// src/types/api/user.ts
export interface User {
  id: number;
  email: string;
  nickname: string;
  profileImage?: string;
  followers?: Follow[];
  followings?: Follow[];
}

export interface Follow {
  followPK: {
    follower: string;
    following: string;
  };
  follower: string;
  following: string;
}

export interface FollowResponse {
  followingIdList: number[];
  followingNicknameList: string[];
  followingCount: number;
  followerIdList?: number[]; // 추가
  followerNicknameList?: string[]; // 추가
  followerCount?: number; // 추가
}

export interface UpdateUserRequest {
  nickname: string;
  profileImage?: string;
}
