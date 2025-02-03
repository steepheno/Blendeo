// src/stores/projectStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import * as projectApi from "@/api/project";
import type {
  Project,
  CreateProjectRequest,
  Comment,
  ProjectListItem,
} from "@/types/api/project";

interface ProjectStore {
  currentProject: Project | null;
  comments: Comment[];
  newProjects: ProjectListItem[];
  createProject: (data: CreateProjectRequest) => Promise<void>;
  getProject: (projectId: number) => Promise<void>;
  updateProjectState: (projectId: number, state: boolean) => Promise<void>;
  updateProjectDetail: (projectId: number, contents: string) => Promise<void>;
  deleteProject: (projectId: number) => Promise<void>;
  likeProject: (projectId: number) => Promise<void>;
  unlikeProject: (projectId: number) => Promise<void>;
  getComments: (projectId: number) => Promise<void>;
  createComment: (projectId: number, comment: string) => Promise<void>;
  deleteComment: (commentId: number, projectId: number) => Promise<void>;
  forkProject: (forkedUrl: string, videoFile: string) => Promise<void>;
  uploadBlendedVideo: (forkedUrl: string, videoFile: string) => Promise<void>;
  getNewProjects: () => Promise<ProjectListItem[]>; // 반환 타입을 ProjectListItem[]로 변경
}

export const useProjectStore = create<ProjectStore>()(
  devtools(
    (set) => ({
      currentProject: null,
      comments: [],
      newProjects: [],

      createProject: async (data) => {
        await projectApi.createProject(data);
      },

      getProject: async (projectId) => {
        const project = await projectApi.getProject(projectId);
        set({ currentProject: project });
      },

      updateProjectState: async (projectId, state) => {
        await projectApi.updateProjectState(projectId, state);
        const project = await projectApi.getProject(projectId);
        set({ currentProject: project });
      },

      updateProjectDetail: async (projectId, contents) => {
        await projectApi.updateProjectDetail(projectId, contents);
        const project = await projectApi.getProject(projectId);
        set({ currentProject: project });
      },

      deleteProject: async (projectId) => {
        await projectApi.deleteProject(projectId);
        set({ currentProject: null });
      },

      likeProject: async (projectId) => {
        await projectApi.likeProject(projectId);
        const project = await projectApi.getProject(projectId);
        set({ currentProject: project });
      },

      unlikeProject: async (projectId) => {
        await projectApi.unlikeProject(projectId);
        const project = await projectApi.getProject(projectId);
        set({ currentProject: project });
      },

      getComments: async (projectId) => {
        const comments = await projectApi.getComments(projectId);
        set({ comments });
      },

      createComment: async (projectId, comment) => {
        await projectApi.createComment(projectId, comment);
        const comments = await projectApi.getComments(projectId);
        set({ comments });
      },

      deleteComment: async (commentId, projectId) => {
        try {
          await projectApi.deleteComment(commentId);
          const comments = await projectApi.getComments(projectId);
          set({ comments });
        } catch (error) {
          console.error("Failed to delete comment:", error);
          throw error;
        }
      },

      forkProject: async (forkedUrl, videoFile) => {
        await projectApi.forkProject(forkedUrl, videoFile);
      },

      uploadBlendedVideo: async (forkedUrl, videoFile) => {
        await projectApi.uploadBlendedVideo(forkedUrl, videoFile);
      },

      getNewProjects: async () => {
        const projects = await projectApi.getNewProjects();
        set({ newProjects: projects });
        return projects;
      },
    }),
    { name: "project-store" }
  )
);
