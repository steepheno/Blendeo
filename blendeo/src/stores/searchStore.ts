// src/stores/searchStore.ts

import { create } from "zustand";
import type {
  SearchState,
  SearchActions,
} from "@/types/components/search/search";

/**
 * SearchStore 인터페이스
 * SearchState와 SearchActions를 상속받아 기본 검색 상태와 액션을 포함하며,
 * 추가로 악기 선택 관련 상태와 액션을 정의합니다.
 */
interface SearchStore extends SearchState, SearchActions {
  selectedInstrument: string | null; // 선택된 악기 ID
  setSelectedInstrument: (instrument: string | null) => void; // 악기 선택 상태 변경 함수
}

/**
 * Zustand를 사용한 검색 상태 관리 스토어
 * 검색 관련 모든 상태와 액션을 중앙 집중적으로 관리합니다.
 */
export const useSearchStore = create<SearchStore>((set) => ({
  // 초기 상태 정의
  searchTerm: "", // 검색어
  searchResults: [], // 검색 결과 배열
  loading: false, // 로딩 상태
  hasMore: false, // 추가 데이터 존재 여부
  currentPage: 0, // 현재 페이지 번호
  selectedInstrument: null, // 선택된 악기

  // 상태 변경 액션 정의

  // 검색어 설정
  setSearchTerm: (term) => set({ searchTerm: term }),

  // 검색 결과 전체 교체
  setSearchResults: (results) => set({ searchResults: results }),

  // 기존 검색 결과에 새로운 결과 추가 (무한 스크롤용)
  appendSearchResults: (results) =>
    set((state) => ({
      searchResults: [...state.searchResults, ...results],
    })),

  // 로딩 상태 설정
  setLoading: (loading) => set({ loading }),

  // 추가 데이터 존재 여부 설정
  setHasMore: (hasMore) => set({ hasMore }),

  // 현재 페이지 번호 설정
  setCurrentPage: (page) => set({ currentPage: page }),

  // 선택된 악기 설정
  setSelectedInstrument: (instrument) =>
    set({ selectedInstrument: instrument }),

  // 모든 검색 관련 상태를 초기값으로 리셋
  resetSearch: () =>
    set({
      searchTerm: "",
      searchResults: [],
      loading: false,
      hasMore: false,
      currentPage: 0,
      selectedInstrument: null,
    }),
}));
