// src/types/api/search.ts
export interface SearchProjectParams {
  title?: string;
  nickname?: string;
  page?: number;
  size?: number;
  instrumentId?: string;
}

export interface SearchProjectResponse {
  projectId: number;
  title: string;
  thumbnail: string;
  viewCnt: number;
  contributionCnt: number;
  duration: number;
  authorId: number;
  authorNickname: string;
  authorProfileImage: string;
  instruments: string[];
  createdAt: string;
}
