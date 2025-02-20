// src/api/project.ts
import axiosInstance from "@/api/axios";
import videoAxiosInstance from "./videoAxios";
import type { userMiniInfo } from "@/types/api/user";
import {
  Project,
  CreateProjectRequest,
  CreateProjectResponse,
  Comment,
  ProjectListItem,
} from "@/types/api/project";

import type { ProjectTreeData } from "@/types/components/project/project";

interface LikeBookmarkStatus {
  scraped: boolean;
  liked: boolean;
}

/* 프로젝트 CRUD */
export const createProject = async (
  data: CreateProjectRequest
): Promise<CreateProjectResponse> => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("state", data.state.toString());
  formData.append("videoUrl", data.videoUrl);

  if (data.forkProjectId !== undefined) {
    formData.append("forkProjectId", data.forkProjectId.toString());
  }

  if (data.instrumentIds?.length) {
    data.instrumentIds.forEach((id) => {
      formData.append("instrumentIds", id.toString());
    });
  }

  if (data.etcName?.length) {
    data.etcName.forEach((name) => {
      formData.append("etcName", name);
    });
  }

  const response = await axiosInstance.post<CreateProjectResponse>(
    "/project/create",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response; // response.data로 반환
};

export const getProject = async (projectId: number) => {
  return axiosInstance.get<Project>(`/project/get/info/${projectId}`);
};

export const getProjectRandom = async () => {
  return axiosInstance.get<Project>(`/project/get/info/random`);
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

/* 프로젝트 소셜 */

// 좋아요 & 북마크 여부 조회
export const checkLikeBookmark = async (projectId: number) => {
  try {
    const response = await axiosInstance.get<LikeBookmarkStatus>(
      `/project/status/${projectId}`
    );
    return response; // axiosInstance가 이미 response.data를 반환하도록 설정되어 있음
  } catch (error) {
    console.error("Error checking like/bookmark status:", error);
    throw error;
  }
};

// 좋아요
export const likeProject = async (projectId: number) => {
  return axiosInstance.post<void>(`/project/like/${projectId}`);
};

export const unlikeProject = async (projectId: number) => {
  return axiosInstance.delete<void>(`/project/like/${projectId}`);
};

// 북마크
export const getBookProject = async () => {
  return axiosInstance.get<void>("/project/scrap");
};

export const bookProject = async (projectId: number) => {
  return axiosInstance.post<void>(`/project/scrap/${projectId}`);
};

export const unbookProject = async (projectId: number) => {
  return axiosInstance.delete<void>(`/project/scrap/${projectId}`);
};

// 댓글
export const getComments = async (projectId: number) => {
  return axiosInstance.get<Comment[]>(`/project/comment/${projectId}`);
};

export const createComment = async (projectId: number, comment: string) => {
  return axiosInstance.post<void>("/project/comment", { projectId, comment });
};

export const deleteComment = async (commentId: number) => {
  return axiosInstance.delete<void>(`/project/comment/${commentId}`);
};

// 부모 프로젝트 조회
export const getParent = async (projectId: number) => {
  return axiosInstance.get<{ projectId: number }>(
    `/project/get/parent?projectId=${projectId}`
  );
};

/* 프로젝트 포크 & 업로드 */
export const forkProject = async (forkedUrl: string, videoFile: string) => {
  return axiosInstance.post<void>("/project/fork", { forkedUrl, videoFile });
};

interface VideoUploadOptions {
  videoFile: File;
  forkedUrl?: string;
  startPoint?: number;
  duration?: number;
  loopCnt?: number;
}

interface UploadProgressCallback {
  (progress: number, uploadedSize: number): void;
}

export const uploadBlendedVideo = async (
  options: VideoUploadOptions,
  onProgress?: UploadProgressCallback
): Promise<string> => {
  try {
    // Validate required fields
    if (!options.videoFile) {
      throw new Error("Video file is required");
    }

    // File size validation
    const fileSizeInBytes = options.videoFile.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

    // You might want to add max file size validation
    const MAX_FILE_SIZE_MB = 500; // Example: 500MB limit
    if (fileSizeInMB > MAX_FILE_SIZE_MB) {
      throw new Error(
        `File size exceeds maximum limit of ${MAX_FILE_SIZE_MB}MB`
      );
    }

    // Log file information
    console.log("File Information:", {
      name: options.videoFile.name,
      type: options.videoFile.type,
      sizeInBytes: fileSizeInBytes,
      sizeInMB: fileSizeInMB.toFixed(2) + " MB",
    });

    // Create FormData and append all available fields
    const formData = new FormData();
    formData.append("videoFile", options.videoFile);

    if (options.forkedUrl) {
      formData.append("forkedUrl", options.forkedUrl);
    }

    if (options.startPoint !== undefined) {
      formData.append("startPoint", options.startPoint.toString());
    }

    if (options.duration !== undefined) {
      formData.append("duration", options.duration.toString());
    }

    if (options.loopCnt !== undefined) {
      formData.append("loopCnt", options.loopCnt.toString());
    }

    console.log(options.startPoint?.toString());
    console.log(options.duration?.toString());
    console.log(options.loopCnt?.toString());

    console.log("formdata:", formData);

    let totalSize = fileSizeInBytes;
    Object.entries(options).forEach(([key, value]) => {
      if (key !== "videoFile" && value !== undefined) {
        totalSize += new Blob([value.toString()]).size;
      }
    });

    console.log("Total FormData Information:", {
      estimatedSizeInBytes: totalSize,
      estimatedSizeInMB: (totalSize / (1024 * 1024)).toFixed(2) + " MB",
    });

    // Make the upload request
    const response = await videoAxiosInstance.post<string>(
      "/project/create/video/blend/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: {
          loaded: number;
          total?: number;
        }) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload Progress: ${percentCompleted}%`);
            onProgress?.(percentCompleted, progressEvent.loaded);
          } else {
            const uploadedMB = (progressEvent.loaded / (1024 * 1024)).toFixed(
              2
            );
            console.log(`Uploaded: ${uploadedMB} MB`);
            onProgress?.(
              0, // Cannot calculate percentage without total
              progressEvent.loaded
            );
          }
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error; // Re-throw to handle in the calling code
  }
};

export const getNewProjects = async (page: number = 0, size: number = 10) => {
  return axiosInstance.get<ProjectListItem[]>(
    `/project/get/new?page=${page}&size=${size}`
  );
};

export const getProjectContributors = async (projectId: number) => {
  return axiosInstance.get<userMiniInfo[]>(
    `/project/get/contributor?projectId=${projectId}`
  );
};

// const getSiblingProject = async (currentProjectId: number, direction: 'next' | 'before') => {
//   return axiosInstance.get<
// };

export const projectTreeAPI = {
  getProjectTree: async (projectId: number): Promise<ProjectTreeData> => {
    const response = await axiosInstance.get<ProjectTreeData>(
      `/fork/hierarchy/${projectId}`
    );
    return response;
  },
};

export const getChildProjects = async (
  projectId: number
): Promise<Project[]> => {
  return axiosInstance.get<Project[]>(
    `/project/get/children?projectId=${projectId}`
  );
};
