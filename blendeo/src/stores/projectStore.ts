// src/stores/projectStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User } from "@/types/api/user";
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
  getNewProjects: () => Promise<ProjectListItem[]>;
  contributors: User[];
  getProjectContributors: (projectId: number) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>()(
  devtools(
    (set) => ({
      currentProject: null,
      comments: [],
      newProjects: [],
      contributors: [],

      createProject: async (data) => {
        await projectApi.createProject(data);
      },

      getProject: async (projectId) => {
        try {
          console.log("Attempting to fetch project:", projectId);
          const project = await projectApi.getProject(projectId);
          console.log("Received project data:", project);
          set({ currentProject: project });
        } catch (error) {
          console.error("Error fetching project:", error);
          throw error;
        }
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

      getNewProjects: async (page = 0, size = 10) => {
        const projects = await projectApi.getNewProjects(page, size);
        set({ newProjects: projects });
        return projects;
      },

      getProjectContributors: async (projectId) => {
        const contributors = await projectApi.getProjectContributors(projectId);
        set({ contributors });
      },
    }),
    { name: "project-store" }
  )
);
