// src/hooks/useSearch.ts
import { useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchStore } from "@/stores/searchStore";
import {
  searchProjects,
  searchByNickname,
  searchByInstrument,
} from "@/api/search";

const ITEMS_PER_PAGE = 10;

export const useSearch = () => {
  const [searchParams] = useSearchParams();
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

  const executeSearch = useCallback(
    async (page: number) => {
      try {
        let results;
        const instrumentId = searchParams.get("instrumentId");
        const searchConfig = {
          page,
          size: ITEMS_PER_PAGE,
        };

        // 검색어가 없고 악기 ID만 있는 경우
        if (!searchTerm && instrumentId) {
          results = await searchByInstrument({
            ...searchConfig,
            instrumentId,
          });
        }
        // @ 으로 시작하는 닉네임 검색
        else if (searchTerm.startsWith("@")) {
          results = await searchByNickname({
            ...searchConfig,
            nickname: searchTerm.slice(1),
            ...(instrumentId ? { instrumentId } : {}),
          });
        }
        // 일반 검색어로 검색
        else if (searchTerm) {
          results = await searchProjects({
            ...searchConfig,
            title: searchTerm,
            ...(instrumentId ? { instrumentId } : {}),
          });
        }
        // 검색어도 없고 악기도 선택되지 않은 경우
        else {
          results = await searchProjects({
            ...searchConfig,
          });
        }

        if (page === 0) {
          setSearchResults(results);
        } else {
          appendSearchResults(results);
        }

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

  useEffect(() => {
    const term = searchParams.get("q") || "";
    const instrument = searchParams.get("instrument") || null;

    resetSearch();
    setSearchTerm(term);
    setSelectedInstrument(instrument);

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

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setLoading(true);
      executeSearch(currentPage + 1);
    }
  }, [loading, hasMore, currentPage, executeSearch, setLoading]);

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
