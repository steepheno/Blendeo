// src/types/components/search/search.ts
import { SearchProjectResponse } from "@/types/api/search";
// 검색 기능의 현재 상태를 나타내는 인터페이스
export interface SearchState {
  searchTerm: string; // 현재 검색어
  searchResults: SearchProjectResponse[]; // 검색 결과 배열
  loading: boolean; // API 호출 로딩 상태
  hasMore: boolean; // 추가 결과 존재 여부 (페이지네이션)
  currentPage: number; // 현재 페이지 번호
  selectedInstrument: string | null; // 현재 선택된 악기 필터
}

// 검색 상태를 변경할 수 있는 모든 액션을 정의하는 인터페이스
export interface SearchActions {
  setSearchTerm: (term: string) => void; // 검색어 업데이트
  setSearchResults: (results: SearchProjectResponse[]) => void; // 검색 결과 전체 교체
  appendSearchResults: (results: SearchProjectResponse[]) => void; // 검색 결과 추가 (페이지네이션)
  setLoading: (loading: boolean) => void; // 로딩 상태 업데이트
  setHasMore: (hasMore: boolean) => void; // 추가 결과 존재 여부 업데이트
  setCurrentPage: (page: number) => void; // 현재 페이지 번호 업데이트
  resetSearch: () => void; // 검색 상태 초기화
}
