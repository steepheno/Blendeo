// 악기 정보를 위한 인터페이스
interface Instrument {
  instrument_id: number;
  instrument_name: string;
}

export interface User {
  id: number;
  email: string;
  nickname: string;
  profileImage: string | null;
  instruments: Instrument[];
  header?: string | null;
  intro?: string | null;
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
  profileImage?: File;
}
