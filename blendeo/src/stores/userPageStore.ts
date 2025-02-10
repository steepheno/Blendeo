import { ProjectListItem } from "@/types/api/project";
import { create } from "zustand";
import { mainPageApi } from "@/api/mainPage";

export type ProjectType = 'uploaded' | 'liked' ;

interface ProjectState {
  items: ProjectListItem[];
  hasMore: boolean;
  currentPage: number;
}

export interface UserPageStore {
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
  uploaded: { ...INITIAL_PROJECT_STATE },
  liked: { ...INITIAL_PROJECT_STATE },
});

const useUserPageStore = create<UserPageStore>((set, get) => ({
  projectStates: createInitialState(),
  loading: {
    uploaded: false,
    liked: false,
  },
  activeTab: 'uploaded',
  lastUpdated: {
    uploaded: null,
    liked: null,
  },

  setActiveTab: (tab: ProjectType) => {
    console.log('[Store] Setting active tab to:', tab);
    set({ activeTab: tab });
    
    const store = get();
    const lastUpdate = store.lastUpdated[tab];
    const hasExpired = !lastUpdate || Date.now() - lastUpdate > CACHE_DURATION;
    
    console.log('[Store] Cache status:', {
      lastUpdate,
      hasExpired,
      itemsCount: store.projectStates[tab].items.length
    });
    
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
      console.log('[Store] Skipping fetch:', { 
        type, 
        loading: store.loading[type], 
        hasMore: state.hasMore,
        forceRefresh 
      });
      return;
    }
    
    set((state: UserPageStore) => ({
      loading: { ...state.loading, [type]: true }
    }));
    
    try {
      console.log(`[Store] Fetching ${type} projects:`, {
        page: forceRefresh ? 0 : state.currentPage,
        size
      });

      let projects: ProjectListItem[];
      
      try {
        switch(type) {
          case 'liked':
            projects = await mainPageApi.getNewProjects(
              forceRefresh ? 0 : state.currentPage, 
              size
            );
            break;
          case 'uploaded':
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

      set((state: UserPageStore) => {
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

        console.log(`[Store] New state after update:`, {
          type,
          newState: newState.projectStates[type]
        });

        return newState;
      });
    } finally {
      set((state: UserPageStore) => ({
        loading: { ...state.loading, [type]: false }
      }));
    }
  },

  loadMore: async (size = PAGE_SIZE) => {
    const { activeTab } = get();
    console.log('[Store] Loading more items for:', activeTab);
    await get().fetchProjects(activeTab, size);
  },

  resetState: (type: ProjectType) => {
    console.log('[Store] Resetting state for:', type);
    set((state: UserPageStore) => ({
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
    console.log('[Store] Getting current projects:', {
      tab: activeTab,
      count: projects.length,
      projects
    });
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

export default useUserPageStore;