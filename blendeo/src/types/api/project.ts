import type { User } from "./user";

interface Instrument {
  instrument_id: number;
  instrument_name: string;
}

export interface Project {
  projectId: number;
  forkId: number;
  title: string;
  contents: string;
  contributorCnt: number;
  authorId: number;
  authorNickname: string;
  authorProfileImage: string;
  likeCnt: number;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  viewCnt: number;
  projectInstruments: Instrument[];
  etcInstruments: Instrument[];
  createdAt: string;
  state: boolean;
}

export interface SimpleProjectData {
  projectId: number;
  videoUrl: string;
}

export interface CreateProjectRequest {
  title: string;
  content: string;
  forkProjectId?: number;
  state: boolean;
  instrumentIds?: number[];
  etcName?: string[];
  videoUrl: string;
}

export interface CreateProjectResponse {
  projectId: number;
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
