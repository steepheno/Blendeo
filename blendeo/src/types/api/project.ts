import type { User } from "./user";

export interface Project {
  id: number;
  forkId: number;
  author: User; // 추가
  title: string; // title
  contents: string;
  contributorCnt: number;
  createdAt: string;
  state: boolean;
  thumbnail: string;
  videoUrl: string;
  runningTime: number;
  viewCnt: number;
  likeCnt: number;
}

export interface CreateProjectRequest {
  title: string;
  content: string;
  forkProjectId?: number;
  state: boolean;
  videoUrl: string;
}

export interface Comment {
  id: number;
  comment: string;
  createdAt: string;
  user: User;
  project: Project;
}

export interface ProjectListItem {
  projectId: number;
  title: string;
  thumbnail: string;
  viewCnt: number;
  forkCnt: number;
  contributionCnt: number;
  authorId: number;
  authorNickname: string;
}
