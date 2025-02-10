// src/api/project.ts
import axiosInstance from "@/api/axios";
import type { User } from "@/types/api/user";
import {
  Project,
  CreateProjectRequest,
  Comment,
  ProjectListItem,
} from "@/types/api/project";

interface CreateProjectResponse {
  projectId: number; // 또는 실제 API 응답 구조에 맞게 수정
}

// 프로젝트 CRUD
export const createProject = async (data: CreateProjectRequest) => {
  const params = new URLSearchParams({
    title: data.title,
    content: data.content,
    state: data.state.toString(),
    videoUrl: data.videoUrl,
  });

  if (data.forkProjectId !== undefined) {
    params.append("forkProjectId", data.forkProjectId.toString());
  }

  // void를 CreateProjectResponse로 변경
  return axiosInstance.post<CreateProjectResponse>(
    `/project/create?${params.toString()}`
  );
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
  videoFile: File
): Promise<string> => {
  // 파일 크기 확인 (바이트 단위)
  const fileSizeInBytes = videoFile.size;
  const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

  console.log("File Information:", {
    name: videoFile.name,
    type: videoFile.type,
    sizeInBytes: fileSizeInBytes,
    sizeInMB: fileSizeInMB.toFixed(2) + " MB",
  });

  const formData = new FormData();
  formData.append("forkedUrl", forkedUrl);
  formData.append("videoFile", videoFile);

  // FormData 전체 크기 추정
  let totalSize = fileSizeInBytes;
  totalSize += new Blob([forkedUrl]).size; // forkedUrl 문자열의 크기

  console.log("Total FormData Information:", {
    estimatedSizeInBytes: totalSize,
    estimatedSizeInMB: (totalSize / (1024 * 1024)).toFixed(2) + " MB",
  });

  const response = await axiosInstance.post<string>(
    "/project/create/video/blend/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent: { loaded: number; total?: number }) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        } else {
          console.log(
            `Uploaded: ${(progressEvent.loaded / (1024 * 1024)).toFixed(2)} MB`
          );
        }
      },
    }
  );

  return response;
};

export const getNewProjects = async (page: number = 0, size: number = 10) => {
  return axiosInstance.get<ProjectListItem[]>(
    `/project/new?page=${page}&size=${size}`
  );
};

export const getProjectContributors = async (projectId: number) => {
  return axiosInstance.get<User[]>(`/project/contributors/${projectId}`);
};
