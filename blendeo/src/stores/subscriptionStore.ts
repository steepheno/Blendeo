import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getFollowingProjects } from "@/api/project";
import type { ProjectListItem } from "@/types/api/project";

interface SubscriptionStore {
  projects: ProjectListItem[];
  isLoading: boolean;
  hasMore: boolean;
  currentPage: number;
  fetchProjects: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionStore>()(
  devtools(
    (set, get) => ({
      projects: [], // 구독 중인 프로젝트 목록
      isLoading: false, // 로딩 상태
      hasMore: true, // 더 불러올 데이터가 있는지
      currentPage: 0, // 현재 페이지

      // 초기 프로젝트 목록을 가져오는 함수
      fetchProjects: async () => {
        set({ isLoading: true });
        try {
          const response = await getFollowingProjects();
          set({
            projects: response.map((project) => ({ ...project, forkCnt: 0 })),
            currentPage: 0,
            hasMore: response.length === 10,
          });
        } catch (error) {
          console.error("구독 프로젝트 조회 실패:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      // 추가 프로젝트를 불러오는 함수 (무한 스크롤)
      loadMore: async () => {
        const { currentPage, isLoading, hasMore } = get();
        if (isLoading || !hasMore) return;

        set({ isLoading: true });
        try {
          const nextPage = currentPage + 1;
          const response = await getFollowingProjects();

          set((state) => ({
            projects: [
              ...state.projects,
              ...response.map((project) => ({ ...project, forkCnt: 0 })),
            ],
            currentPage: nextPage,
            hasMore: response.length === 10,
          }));
        } catch (error) {
          console.error("추가 프로젝트 로드 실패:", error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    { name: "subscription-store" }
  )
);
