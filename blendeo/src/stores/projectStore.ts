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

type RedirectSource = 'project-edit' | 'project-create' | 'project-detail' | 'project-fork';

interface RedirectState {
  project: Project | null;
  source: RedirectSource | null;
}

interface BlendedUrl {
  url: string | null;
  getUrl: () => string | null;
  setUrl: (url: string | null) => void;
  clear: () => void;
}

interface SeedUrl {
  url: string | null;
  getUrl: () => string | null;
  setUrl: (url: string | null) => void;
  clear: () => void;
}

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
  redirectState: RedirectState;
  setRedirectState: (project: Project, source: RedirectSource) => void;
  clearRedirectState: () => void;
  getRedirectState: (source: RedirectSource) => Project | null;
}

export const useProjectStore = create<ProjectStore>()(
  devtools(
    (set, get: () => ProjectStore) => ({
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

      redirectState: {
        project: null,
        source: null
      },

      setRedirectState: (project: Project, source: RedirectSource) => {
        set({
          redirectState: {
            project,
            source
          }
        });
      },

      clearRedirectState: () => {
        set({
          redirectState: {
            project: null,
            source: null
          }
        });
      },

      getRedirectState: (source: RedirectSource) => {
        const { redirectState } = get();
        if (redirectState.source === source) {
          return redirectState.project;
        }
        return null;
      },
    }),
    { name: "project-store" }
  )
);

export const useEditStore = create<BlendedUrl>()(
  devtools(
    (set, get) => ({
      url: null,
      getUrl: () => get().url,
      setUrl: (url) => set({ url }),
      clear: () => set({ url: null }),
    }),
    { name: "edit-store" }
  )
);

export const useSeedStore = create<SeedUrl>()(
  devtools(
    (set, get) =>({
      url: null,
      getUrl: () => get().url,
      setUrl: (url) => set({ url }),
      clear: () => set({ url: null }),
    }),
    {name: "seed-store" }
  )
);