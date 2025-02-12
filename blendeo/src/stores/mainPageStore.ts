import { ProjectListItem } from "@/types/api/project";
import { create } from "zustand";
import { mainPageApi } from "@/api/mainPage";

export type ProjectType = 'forYou' | 'ranking' | 'latest';

interface ProjectState {
  items: ProjectListItem[];
  hasMore: boolean;
  currentPage: number;
}

export interface MainPageStore {
  projectStates: {
    [K in ProjectType]: ProjectState;
  };
  loading: {
    [K in ProjectType]: boolean;
  };
  activeTab: ProjectType;
  lastUpdated: {
    [K in ProjectType]: number | null;
  };
  
  setActiveTab: (tab: ProjectType) => void;
  fetchProjects: (type: ProjectType, size?: number, forceRefresh?: boolean) => Promise<void>;
  loadMore: (size?: number) => Promise<void>;
  resetState: (type: ProjectType) => void;
  
  getCurrentProjects: () => ProjectListItem[];
  getIsLoading: () => boolean;
  getHasMore: () => boolean;
}

const INITIAL_PROJECT_STATE: ProjectState = {
  items: [],
  hasMore: true,
  currentPage: 0,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5분
const PAGE_SIZE = 10;

const createInitialState = () => ({
  forYou: { ...INITIAL_PROJECT_STATE },
  ranking: { ...INITIAL_PROJECT_STATE },
  latest: { ...INITIAL_PROJECT_STATE },
});

const useMainPageStore = create<MainPageStore>((set, get) => ({
  projectStates: createInitialState(),
  loading: {
    forYou: false,
    ranking: false,
    latest: false,
  },
  activeTab: 'forYou',
  lastUpdated: {
    forYou: null,
    ranking: null,
    latest: null,
  },

  setActiveTab: (tab: ProjectType) => {
    set({ activeTab: tab });
    
    const store = get();
    const lastUpdate = store.lastUpdated[tab];
    const hasExpired = !lastUpdate || Date.now() - lastUpdate > CACHE_DURATION;
    
    // 캐시된 데이터가 없거나 만료된 경우에만 새로 fetch
    if (store.projectStates[tab].items.length === 0 || hasExpired) {
      get().fetchProjects(tab, PAGE_SIZE, true);
    }
  },

  fetchProjects: async (type: ProjectType, size = PAGE_SIZE, forceRefresh = false) => {
    const store = get();
    const state = store.projectStates[type];
    
    // 이미 로딩 중이거나 더 이상 불러올 데이터가 없으면 중단
    if (store.loading[type] || (!forceRefresh && !state.hasMore)) {
      return;
    }
    
    set((state: MainPageStore) => ({
      loading: { ...state.loading, [type]: true }
    }));
    
    try {
      let projects: ProjectListItem[];
      
      try {
        switch(type) {
          case 'latest':
            projects = await mainPageApi.getNewProjects(
              forceRefresh ? 0 : state.currentPage, 
              size
            );
            break;
          case 'ranking':
            projects = await mainPageApi.getNewProjects(
              forceRefresh ? 0 : state.currentPage, 
              size
            );
            break;
          case 'forYou':
          default:
            projects = await mainPageApi.getNewProjects(
              forceRefresh ? 0 : state.currentPage, 
              size
            );
            break;
        }
        console.log(`[Store] API Response for ${type}:`, projects);
      } catch (error) {
        console.error(`[Store] Failed to fetch ${type} projects:`, error);
        throw error;
      }

      set((state: MainPageStore) => {
        const newState = {
          projectStates: {
            ...state.projectStates,
            [type]: {
              items: forceRefresh 
                ? projects 
                : [...state.projectStates[type].items, ...projects],
              hasMore: projects.length === size,
              currentPage: forceRefresh ? 1 : state.projectStates[type].currentPage + 1,
            }
          },
          lastUpdated: {
            ...state.lastUpdated,
            [type]: forceRefresh ? Date.now() : state.lastUpdated[type]
          }
        };

        return newState;
      });
    } finally {
      set((state: MainPageStore) => ({
        loading: { ...state.loading, [type]: false }
      }));
    }
  },

  loadMore: async (size = PAGE_SIZE) => {
    const { activeTab } = get();
    await get().fetchProjects(activeTab, size);
  },

  resetState: (type: ProjectType) => {
    set((state: MainPageStore) => ({
      projectStates: {
        ...state.projectStates,
        [type]: { ...INITIAL_PROJECT_STATE }
      },
      lastUpdated: {
        ...state.lastUpdated,
        [type]: null
      }
    }));
  },

  getCurrentProjects: () => {
    const { projectStates, activeTab } = get();
    const projects = projectStates[activeTab].items;
    return projects;
  },

  getIsLoading: () => {
    const { loading, activeTab } = get();
    return loading[activeTab];
  },

  getHasMore: () => {
    const { projectStates, activeTab } = get();
    return projectStates[activeTab].hasMore;
  },
}));

export default useMainPageStore;