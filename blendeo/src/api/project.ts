// src/api/project.ts
import axiosInstance from "@/api/axios";
import type { User } from "@/types/api/user";
import {
  Project,
  CreateProjectRequest,
  Comment,
  ProjectListItem,
} from "@/types/api/project";

export const createProject = async (data: CreateProjectRequest) => {
  return axiosInstance.post<void>("/project/create", data);
};

export const getProject = async (projectId: number) => {
  return axiosInstance.get<Project>(`/project/info/${projectId}`);
};

export const updateProjectState = async (projectId: number, state: boolean) => {
  return axiosInstance.patch<void>(`/project/state/${projectId}`, { state });
};

export const updateProjectDetail = async (
  projectId: number,
  contents: string
) => {
  return axiosInstance.patch<void>("/project/detail", { projectId, contents });
};

export const deleteProject = async (projectId: number) => {
  return axiosInstance.delete<void>(`/project/${projectId}`);
};

// 프로젝트 소셜
export const likeProject = async (projectId: number) => {
  return axiosInstance.post<void>(`/project/like/${projectId}`);
};

export const unlikeProject = async (projectId: number) => {
  return axiosInstance.delete<void>(`/project/like/${projectId}`);
};

export const getComments = async (projectId: number) => {
  return axiosInstance.get<Comment[]>(`/project/comment/${projectId}`);
};

export const createComment = async (projectId: number, comment: string) => {
  return axiosInstance.post<void>("/project/comment", { projectId, comment });
};

export const deleteComment = async (commentId: number) => {
  return axiosInstance.delete<void>(`/project/comment/${commentId}`);
};

// 프로젝트 포크/업로드
export const forkProject = async (forkedUrl: string, videoFile: string) => {
  return axiosInstance.post<void>("/project/fork", { forkedUrl, videoFile });
};

export const uploadBlendedVideo = async (
  forkedUrl: string,
  videoFile: string
) => {
  return axiosInstance.post<void>("/project/create/video/blend/upload", {
    forkedUrl,
    videoFile,
  });
};

export const getNewProjects = async (page: number = 0, size: number = 10) => {
  return axiosInstance.get<ProjectListItem[]>(
    `/project/new?page=${page}&size=${size}`
  );
};

export const getProjectContributors = async (projectId: number) => {
  return axiosInstance.get<User[]>(`/project/contributors/${projectId}`);
};
