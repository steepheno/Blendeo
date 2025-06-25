import { ProjectListItem } from "@/types/api/project";
import { create } from "zustand";
import { mainPageApi } from "@/api/mainPage";
import { User } from "@/types/api/user";
import {
  getUser,
  followUser as apiFollowUser,
  unfollowUser as apiUnfollowUser,
  getFollowers,
  getFollowings,
  checkFollowing,
} from "@/api/user";
import { useAuthStore } from "./authStore";

export type ProjectType = "uploaded";

interface ProjectState {
  items: ProjectListItem[];
  hasMore: boolean;
  currentPage: number;
}

interface FollowData {
  followingCount: number;
  followerCount: number;
  isFollowing: boolean;
  loading: boolean;
  error: Error | null;
  followerIdList: number[];
  followerNicknameList: string[];
  followingIdList: number[];
  followingNicknameList: string[];
}

export interface UserPageStore {
  // 기본 상태
  user: User | null;
  userLoading: boolean;
  userError: Error | null;
  followData: FollowData;

  // 프로젝트 관련 상태
  projectStates: Record<ProjectType, ProjectState>;
  loading: Record<ProjectType, boolean>;
  activeTab: ProjectType;
  lastUpdated: Record<ProjectType, number | null>;

  // 기본 액션
  fetchInitialData: (userId: number) => Promise<void>;
  resetUser: () => void;

  // 프로젝트 관련 액션
  setActiveTab: (tab: ProjectType) => void;
  fetchProjects: (
    type: ProjectType,
    size?: number,
    forceRefresh?: boolean
  ) => Promise<void>;
  loadMore: () => Promise<void>;
  resetProjects: (type?: ProjectType) => void;

  // Getter 메서드
  getCurrentProjects: () => ProjectListItem[];
  getProjectLoading: () => boolean;
  getHasMoreProjects: () => boolean;

  // 팔로우 관련 액션
  followUser: (userId: number) => Promise<void>;
  unfollowUser: (userId: number) => Promise<void>;
}

const INITIAL_PROJECT_STATE: ProjectState = {
  items: [],
  hasMore: true,
  currentPage: 0,
};

const INITIAL_FOLLOW_DATA: FollowData = {
  followingCount: 0,
  followerCount: 0,
  isFollowing: false,
  loading: false,
  error: null,
  followerIdList: [],
  followerNicknameList: [],
  followingIdList: [],
  followingNicknameList: [],
};

export const CACHE_DURATION = 5 * 60 * 1000; // 5분
export const PAGE_SIZE = 12;

const createInitialProjectStates = (): Record<ProjectType, ProjectState> => ({
  uploaded: { ...INITIAL_PROJECT_STATE },
});

const useUserPageStore = create<UserPageStore>((set, get) => ({
  // 기본 상태 초기화
  user: null,
  userLoading: false,
  userError: null,
  followData: INITIAL_FOLLOW_DATA,

  // 프로젝트 상태 초기화
  projectStates: createInitialProjectStates(),
  loading: {
    uploaded: false,
  },
  activeTab: "uploaded",
  lastUpdated: {
    uploaded: null,
  },

  // 기본 액션
  fetchInitialData: async (userId: number) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    try {
      set({
        userLoading: true,
        followData: { ...INITIAL_FOLLOW_DATA, loading: true },
      });

      const [user, followers, followings, isFollowing] = await Promise.all([
        getUser(userId),
        getFollowers(userId),
        getFollowings(userId),
        isAuthenticated ? checkFollowing(userId) : Promise.resolve(false),
      ]);

      set({
        user,
        followData: {
          followerCount: followers.followerCount,
          followingCount: followings.followingCount,
          isFollowing,
          loading: false,
          error: null,
          followerIdList: followers.followerIdList,
          followerNicknameList: followers.followerNicknameList,
          followingIdList: followings.followingIdList,
          followingNicknameList: followings.followingNicknameList,
        },
      });
    } catch (error) {
      const userError =
        error instanceof Error
          ? error
          : new Error("Failed to fetch initial data");
      set({
        userError,
        followData: { ...INITIAL_FOLLOW_DATA, error: userError },
      });
    } finally {
      set({ userLoading: false });
    }
  },

  resetUser: () => {
    set({
      user: null,
      userLoading: false,
      userError: null,
      followData: INITIAL_FOLLOW_DATA,
    });
  },

  // 프로젝트 관련 액션
  setActiveTab: (tab: ProjectType) => {
    set({ activeTab: tab });
    const { lastUpdated, projectStates } = get();
    const lastUpdate = lastUpdated[tab];
    const hasExpired = !lastUpdate || Date.now() - lastUpdate > CACHE_DURATION;

    if (projectStates[tab].items.length === 0 || hasExpired) {
      get().fetchProjects(tab, PAGE_SIZE, true);
    }
  },

  fetchProjects: async (
    type: ProjectType,
    size = PAGE_SIZE,
    forceRefresh = false
  ) => {
    const { loading, projectStates } = get();

    if (loading[type] || (!forceRefresh && !projectStates[type].hasMore)) {
      return;
    }

    set({ loading: { ...loading, [type]: true } });

    try {
      const currentPage = forceRefresh ? 0 : projectStates[type].currentPage;
      const projects = await mainPageApi.getNewProjects(currentPage, size);

      set((state) => ({
        projectStates: {
          ...state.projectStates,
          [type]: {
            items: forceRefresh
              ? projects
              : [...state.projectStates[type].items, ...projects],
            hasMore: projects.length === size,
            currentPage: forceRefresh
              ? 1
              : state.projectStates[type].currentPage + 1,
          },
        },
        lastUpdated: {
          ...state.lastUpdated,
          [type]: Date.now(),
        },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, [type]: false },
      }));
    }
  },

  loadMore: async () => {
    const { activeTab } = get();
    await get().fetchProjects(activeTab);
  },

  resetProjects: (type?: ProjectType) => {
    if (type) {
      set((state) => ({
        projectStates: {
          ...state.projectStates,
          [type]: { ...INITIAL_PROJECT_STATE },
        },
        lastUpdated: {
          ...state.lastUpdated,
          [type]: null,
        },
      }));
    } else {
      set({
        projectStates: createInitialProjectStates(),
        lastUpdated: {
          uploaded: null,
        },
      });
    }
  },

  // Getter 메서드
  getCurrentProjects: () => {
    const { projectStates, activeTab } = get();
    return projectStates[activeTab].items;
  },

  getProjectLoading: () => {
    const { loading, activeTab } = get();
    return loading[activeTab];
  },

  getHasMoreProjects: () => {
    const { projectStates, activeTab } = get();
    return projectStates[activeTab].hasMore;
  },

  // 팔로우 관련 액션
  followUser: async (userId: number) => {
    set((state) => ({
      followData: { ...state.followData, loading: true },
    }));

    try {
      await apiFollowUser(userId);
      const [followers, followings] = await Promise.all([
        getFollowers(userId),
        getFollowings(userId),
      ]);

      set((state) => ({
        followData: {
          ...state.followData,
          followerCount: followers.followerCount,
          followingCount: followings.followingCount,
          isFollowing: true,
          loading: false,
        },
      }));
    } catch (error) {
      const followError =
        error instanceof Error ? error : new Error("Failed to follow user");
      set((state) => ({
        followData: {
          ...state.followData,
          error: followError,
          loading: false,
        },
      }));
      throw followError;
    }
  },

  unfollowUser: async (userId: number) => {
    set((state) => ({
      followData: { ...state.followData, loading: true },
    }));

    try {
      await apiUnfollowUser(userId);
      const [followers, followings] = await Promise.all([
        getFollowers(userId),
        getFollowings(userId),
      ]);

      set((state) => ({
        followData: {
          ...state.followData,
          followerCount: followers.followerCount,
          followingCount: followings.followingCount,
          isFollowing: false,
          loading: false,
        },
      }));
    } catch (error) {
      const followError =
        error instanceof Error ? error : new Error("Failed to unfollow user");
      set((state) => ({
        followData: {
          ...state.followData,
          error: followError,
          loading: false,
        },
      }));
      throw followError;
    }
  },
}));

export default useUserPageStore;
