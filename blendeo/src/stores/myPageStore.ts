import { ProjectListItem } from "@/types/api/project";
import { create } from "zustand";
import { userPageApi } from "@/api/userPage";
import { User } from "@/types/api/user";
import {
  getUser,
  updateProfile,
  getFollowers,
  getFollowings,
} from "@/api/user";
import { useAuthStore } from "./authStore";

export type ProjectType = "uploaded" | "scraped";

interface ProjectState {
  items: ProjectListItem[];
  hasMore: boolean;
  currentPage: number;
}

interface EditData {
  nickname: string;
  intro: string;
  profileImage: File | null;
  header: File | null;
}

interface FollowData {
  isFollowing: boolean;
  followerCount: number;
  followingCount: number;
  loading: boolean;
  error: Error | null;
  followingIdList: number[];
  followingNicknameList: string[];
  followerIdList: number[];
  followerNicknameList: string[];
}

export interface MyPageStore {
  // 기본 상태
  profile: User | null;
  profileLoading: boolean;
  profileError: Error | null;
  followData: FollowData;

  // 프로젝트 관련 상태
  projectStates: Record<ProjectType, ProjectState>;
  loading: Record<ProjectType, boolean>;
  activeTab: ProjectType;
  lastUpdated: Record<ProjectType, number | null>;

  // 편집 상태
  isEditMode: boolean;
  editData: EditData;

  // 기본 액션
  fetchProfile: (userId: number) => Promise<void>;
  resetProfile: () => void;
  fetchInitialData: (userId: number) => Promise<void>;

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

  // 편집 관련 액션
  setEditMode: (isEdit: boolean) => void;
  updateEditData: (data: Partial<EditData>) => void;
  resetEditData: () => void;
  saveProfile: () => Promise<void>;
}

const INITIAL_PROJECT_STATE: ProjectState = {
  items: [],
  hasMore: true,
  currentPage: 0,
};

const INITIAL_EDIT_DATA: EditData = {
  nickname: "",
  intro: "",
  profileImage: null,
  header: null,
};

const INITIAL_FOLLOW_DATA: FollowData = {
  isFollowing: false,
  followerCount: 0,
  followingCount: 0,
  loading: false,
  error: null,
  followingIdList: [],
  followingNicknameList: [],
  followerIdList: [],
  followerNicknameList: [],
};

export const CACHE_DURATION = 5 * 60 * 1000; // 5분
export const PAGE_SIZE = 12;

const createInitialProjectStates = (): Record<ProjectType, ProjectState> => ({
  uploaded: { ...INITIAL_PROJECT_STATE },
  scraped: { ...INITIAL_PROJECT_STATE },
});

const useMyPageStore = create<MyPageStore>((set, get) => ({
  // 기본 상태 초기화
  profile: null,
  profileLoading: false,
  profileError: null,
  followData: INITIAL_FOLLOW_DATA,

  // 프로젝트 상태 초기화
  projectStates: createInitialProjectStates(),
  loading: {
    uploaded: false,
    scraped: false,
  },
  activeTab: "uploaded",
  lastUpdated: {
    uploaded: null,
    scraped: null,
  },

  // 편집 상태 초기화
  isEditMode: false,
  editData: INITIAL_EDIT_DATA,

  // 기본 액션
  fetchProfile: async (userId: number) => {
    set({ profileLoading: true, profileError: null });
    try {
      const profile = await getUser(userId);
      set({ profile });
    } catch (error) {
      const profileError =
        error instanceof Error ? error : new Error("Failed to fetch profile");
      set({ profileError });
      throw profileError;
    } finally {
      set({ profileLoading: false });
    }
  },

  resetProfile: () => {
    set({
      profile: null,
      profileLoading: false,
      profileError: null,
      followData: INITIAL_FOLLOW_DATA,
    });
  },

  fetchInitialData: async (userId: number) => {
    try {
      set({
        profileLoading: true,
        followData: { ...INITIAL_FOLLOW_DATA, loading: true },
      });
      const [profile, followers, followings] = await Promise.all([
        getUser(userId),
        getFollowers(userId),
        getFollowings(userId),
      ]);

      set({
        profile,
        followData: {
          followerCount: followers.followerCount,
          followingCount: followings.followingCount,
          isFollowing: false,
          loading: false,
          error: null,
          followingIdList: followings.followingIdList,
          followingNicknameList: followings.followingNicknameList,
          followerIdList: followers.followerIdList,
          followerNicknameList: followers.followerNicknameList,
        },
      });
    } catch (error) {
      const profileError =
        error instanceof Error
          ? error
          : new Error("Failed to fetch initial data");
      set({
        profileError,
        followData: { ...INITIAL_FOLLOW_DATA, error: profileError },
      });
    } finally {
      set({ profileLoading: false });
    }
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

  // fetchProjects 함수의 에러 처리를 개선합니다
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
      const apiMethod =
        type === "scraped"
          ? userPageApi.getScrapProjects
          : userPageApi.getNewProjects;
      const currentPage = forceRefresh ? 0 : projectStates[type].currentPage;
      const userId = useAuthStore.getState().userId as number;

      const projects = await apiMethod(userId, currentPage, size);

      set((state) => ({
        projectStates: {
          ...state.projectStates,
          [type]: {
            items: forceRefresh
              ? projects
              : [...state.projectStates[type].items, ...projects],
            hasMore: projects.length === size,
            currentPage: currentPage + 1,
          },
        },
        lastUpdated: {
          ...state.lastUpdated,
          [type]: Date.now(),
        },
      }));
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      set((state) => ({
        projectStates: {
          ...state.projectStates,
          [type]: {
            ...state.projectStates[type],
            hasMore: false,
          },
        },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, [type]: false },
      }));
    }
  },

  loadMore: async () => {
    const { activeTab, loading, projectStates } = get();

    // 이미 로딩 중이거나 더 이상 불러올 데이터가 없는 경우 중단
    if (loading[activeTab] || !projectStates[activeTab].hasMore) {
      return;
    }

    // 데이터 가져오기
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
          scraped: null,
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

  // 편집 관련 액션
  setEditMode: (isEdit: boolean) => {
    const { profile } = get();
    set({
      isEditMode: isEdit,
      editData: isEdit
        ? {
            nickname: profile?.nickname || "",
            intro: profile?.intro || "",
            profileImage: null,
            header: null,
          }
        : INITIAL_EDIT_DATA,
    });
  },

  updateEditData: (data: Partial<EditData>) => {
    set((state) => ({
      editData: { ...state.editData, ...data },
    }));
  },

  resetEditData: () => {
    set({
      editData: INITIAL_EDIT_DATA,
      isEditMode: false,
    });
  },

  saveProfile: async () => {
    const { editData, profile } = get();
    if (!profile) return;

    try {
      await updateProfile({
        nickname: editData.nickname,
        intro: editData.intro,
        profileImage: editData.profileImage,
        header: editData.header,
      });

      await get().fetchProfile(profile.id);
      set({
        isEditMode: false,
        editData: INITIAL_EDIT_DATA,
      });
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Failed to update profile");
    }
  },
}));

export default useMyPageStore;
