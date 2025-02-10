import type { User } from "./user";

export interface Project {
  id: number;
  forkId: number;
  author: User;
  title: string;
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
  thumbnail: string | null;
  duration: number;
  viewCnt: number;
  forkCnt: number;
  contributionCnt: number;
  createdAt: string;
  authorId: number;
  authorNickname: string;
  authorProfileImage?: string;
  instruments: string[];
}
