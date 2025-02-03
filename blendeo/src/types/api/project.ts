import type { User } from "./user";

export interface Project {
  id: number;
  forkId: number;
  author: User; // 추가
  title: string; // projectTitle → title
  contents: string;
  contributorCnt: number;
  createdAt: string;
  state: boolean;
  thumbnail: string;
  runningTime: number;
  viewCnt: number;
  likeCnt: number;
  videoUrl: string; // 추가
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
  projectTitle: string;
  thumbnail: string;
  viewCnt: number;
  forkCnt: number;
  contributionCnt: number;
  authorId: number;
  authorNickname: string;
}
