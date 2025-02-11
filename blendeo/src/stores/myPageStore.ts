import { ProjectListItem } from "@/types/api/project";
import { create } from "zustand";
import { mainPageApi } from "@/api/mainPage";
import { User } from "@/types/api/user";
import {
  getUser,
  updateProfile,
  getFollowers,
  getFollowings,
} from "@/api/user";

export type ProjectType = "uploaded" | "scraped" /*| 'liked' */;

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

interface FollowState {
  followingIdList: number[];
  followingNicknameList: string[];
  followingCount: number;
  followerIdList: number[];
  followerNicknameList: string[];
  followerCount: number;
  loading: boolean;
  error: Error | null;
}

export interface MyPageStore {
  // Profile 관련 상태
  profile: User | null;
  profileLoading: boolean;
  profileError: Error | null;

  // Project 관련 상태
  projectStates: Record<ProjectType, ProjectState>;
  projectLoading: Record<ProjectType, boolean>;
  activeTab: ProjectType;
  lastUpdated: Record<ProjectType, number | null>;

  // 프로필 편집 관련 상태
  isEditMode: boolean;
  editData: EditData;

  // Follow 상태
  followData: FollowState;

  // Profile 관련 액션
  fetchProfile: (userId: number) => Promise<void>;
  resetProfile: () => void;
  updateProfileData: (data: Partial<User>) => Promise<void>;

  // Project 관련 액션
  setActiveTab: (tab: ProjectType) => void;
  fetchProjects: (
    type: ProjectType,
    size?: number,
    forceRefresh?: boolean
  ) => Promise<void>;
  loadMore: () => Promise<void>;
  resetProjects: (type?: ProjectType) => void;
  shouldFetchProjects: (type: ProjectType) => boolean; // 추가된 부분

  // Edit 관련 액션
  setEditMode: (isEdit: boolean) => void;
  updateEditData: (data: Partial<EditData>) => void;
  resetEditData: () => void;
  saveProfile: () => Promise<void>;

  //Follow 액션
  fetchFollowData: (userId: number) => Promise<void>;
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

const INITIAL_FOLLOW_STATE: FollowState = {
  followingIdList: [],
  followingNicknameList: [],
  followingCount: 0,
  followerIdList: [],
  followerNicknameList: [],
  followerCount: 0,
  loading: false,
  error: null,
};

export const CACHE_DURATION = 5 * 60 * 1000; // 5분
export const PAGE_SIZE = 12;

const createInitialProjectStates = (): Record<ProjectType, ProjectState> => ({
  uploaded: { ...INITIAL_PROJECT_STATE },
  // liked: { ...INITIAL_PROJECT_STATE },
  scraped: { ...INITIAL_PROJECT_STATE },
});

const useMyPageStore = create<MyPageStore>((set, get) => ({
  // Profile 상태
  profile: null,
  profileLoading: false,
  profileError: null,

  // Project 상태
  projectStates: createInitialProjectStates(),
  projectLoading: {
    uploaded: false,
    // liked: false,
    scraped: false,
  },
  activeTab: "uploaded",
  lastUpdated: {
    uploaded: null,
    // liked: null,
    scraped: null,
  },

  // Edit 상태
  isEditMode: false,
  editData: INITIAL_EDIT_DATA,

  // Follow 상태 추가
  followData: INITIAL_FOLLOW_STATE,

  // Profile 관련 액션
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
    });
  },

  updateProfileData: async (data: Partial<User>) => {
    const { profile } = get();
    if (!profile) return;

    set({ profile: { ...profile, ...data } });
  },

  setActiveTab: (tab: ProjectType) => {
    set({ activeTab: tab });
  },

  shouldFetchProjects: (type: ProjectType) => {
    const { lastUpdated, projectStates } = get();
    const lastUpdate = lastUpdated[type];
    const hasExpired = !lastUpdate || Date.now() - lastUpdate > CACHE_DURATION;
    return projectStates[type].items.length === 0 || hasExpired;
  },

  fetchProjects: async (
    type: ProjectType,
    size = PAGE_SIZE,
    forceRefresh = false
  ) => {
    const { projectLoading, projectStates, shouldFetchProjects } = get();

    // 이미 로딩 중이거나, 강제 새로고침이 아니고, 캐시가 유효하면 중단
    if (projectLoading[type] || (!forceRefresh && !shouldFetchProjects(type))) {
      return;
    }

    set({ projectLoading: { ...projectLoading, [type]: true } });

    try {
      const apiMethod = (() => {
        switch (type) {
          // case 'liked': return mainPageApi.getNewProjects;
          case "scraped":
            return mainPageApi.getNewProjects;
          default:
            return mainPageApi.getNewProjects;
        }
      })();

      const currentPage = forceRefresh ? 0 : projectStates[type].currentPage;
      const projects = await apiMethod(currentPage, size);

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
    } finally {
      set((state) => ({
        projectLoading: { ...state.projectLoading, [type]: false },
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
          // liked: null,
          scraped: null,
        },
      });
    }
  },

  // Edit 관련 액션
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
  // Follow 액션 추가
  fetchFollowData: async (userId: number) => {
    set((state) => ({
      followData: {
        ...state.followData,
        loading: true,
        error: null,
      },
    }));

    try {
      const [followersResponse, followingsResponse] = await Promise.all([
        getFollowers(userId),
        getFollowings(userId),
      ]);

      set({
        followData: {
          ...followersResponse,
          ...followingsResponse,
          loading: false,
          error: null,
        },
      });
    } catch (error) {
      set((state) => ({
        followData: {
          ...state.followData,
          loading: false,
          error:
            error instanceof Error
              ? error
              : new Error("Failed to fetch follow data"),
        },
      }));
    }
  },
}));

export default useMyPageStore;
