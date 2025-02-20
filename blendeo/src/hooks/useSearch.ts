// src/hooks/useSearch.ts

import { useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchStore } from "@/stores/searchStore";
import {
  searchProjects,
  searchByNickname,
  searchByInstrument,
} from "@/api/search";

// 한 페이지당 표시할 검색 결과 개수
const ITEMS_PER_PAGE = 10;

/**
 * 검색 기능을 관리하는 커스텀 훅
 * URL 파라미터, 검색 상태, 페이지네이션을 처리합니다.
 */
export const useSearch = () => {
  const [searchParams] = useSearchParams();
  // Zustand 스토어에서 필요한 상태와 액션들을 가져옴
  const {
    searchTerm,
    searchResults,
    loading,
    hasMore,
    currentPage,
    selectedInstrument,
    setSearchTerm,
    setSearchResults,
    appendSearchResults,
    setLoading,
    setHasMore,
    setCurrentPage,
    setSelectedInstrument,
    resetSearch,
  } = useSearchStore();

  /**
   * 검색을 실행하는 콜백 함수
   * 검색 타입(일반, 닉네임, 악기)에 따라 적절한 API를 호출합니다.
   * @param page 검색할 페이지 번호
   */
  const executeSearch = useCallback(
    async (page: number) => {
      try {
        let results;
        const instrumentId = searchParams.get("instrumentId");
        const searchConfig = {
          page,
          size: ITEMS_PER_PAGE,
        };

        // 검색 조건에 따른 API 호출 분기 처리
        if (!searchTerm && instrumentId) {
          // 케이스 1: 악기 ID만으로 검색
          results = await searchByInstrument({
            ...searchConfig,
            instrumentId,
          });
        } else if (searchTerm.startsWith("@")) {
          // 케이스 2: @로 시작하는 닉네임 검색
          results = await searchByNickname({
            ...searchConfig,
            nickname: searchTerm.slice(1), // @ 제거
            ...(instrumentId ? { instrumentId } : {}),
          });
        } else if (searchTerm) {
          // 케이스 3: 일반 검색어로 검색
          results = await searchProjects({
            ...searchConfig,
            title: searchTerm,
            ...(instrumentId ? { instrumentId } : {}),
          });
        } else {
          // 케이스 4: 검색어 없이 전체 검색
          results = await searchProjects({
            ...searchConfig,
          });
        }

        // 검색 결과 처리
        if (page === 0) {
          setSearchResults(results); // 첫 페이지: 결과 교체
        } else {
          appendSearchResults(results); // 이후 페이지: 결과 추가
        }

        // 페이지네이션 상태 업데이트
        setHasMore(results.length === ITEMS_PER_PAGE);
        setCurrentPage(page);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
        setHasMore(false);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [
      searchTerm,
      appendSearchResults,
      setSearchResults,
      setCurrentPage,
      setHasMore,
      setLoading,
      searchParams,
    ]
  );

  /**
   * URL 파라미터 변경 감지 및 초기 검색 실행
   * 검색어(q)나 악기(instrument) 파라미터가 변경되면 검색을 다시 실행합니다.
   */
  useEffect(() => {
    const term = searchParams.get("q") || "";
    const instrument = searchParams.get("instrument") || null;

    // 검색 상태 초기화
    resetSearch();
    setSearchTerm(term);
    setSelectedInstrument(instrument);

    // 초기 검색 실행
    setLoading(true);
    executeSearch(0).catch((error) => {
      console.error("Initial search failed:", error);
      setLoading(false);
    });
  }, [
    searchParams,
    executeSearch,
    resetSearch,
    setLoading,
    setSearchTerm,
    setSelectedInstrument,
  ]);

  /**
   * 추가 데이터 로드 함수 (무한 스크롤용)
   * 로딩 중이 아니고 추가 데이터가 있는 경우에만 실행됩니다.
   */
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setLoading(true);
      executeSearch(currentPage + 1);
    }
  }, [loading, hasMore, currentPage, executeSearch, setLoading]);

  // 훅에서 사용할 상태와 함수들을 반환
  return {
    searchTerm,
    searchResults,
    loading,
    hasMore,
    loadMore,
    selectedInstrument,
    setSelectedInstrument,
    resetSearch,
  };
};
