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

export interface userMiniInfo {
  userId: number;
  nickname: string;
  profileImage: string;
  instruments: Instrument[];
  etcInstruments: Instrument[];
}

export interface UpdateUserRequest {
  nickname: string;
  profileImage?: File;
}

export interface FollowingResponse {
  followingIdList: number[];
  followingNicknameList: string[];
  followingCount: number;
}

// 팔로워 응답을 위한 인터페이스
export interface FollowerResponse {
  followerIdList: number[];
  followerNicknameList: string[];
  followerCount: number;
}
