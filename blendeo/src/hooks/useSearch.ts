// src/hooks/useSearch.ts
import { useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchStore } from "@/stores/searchStore";
import { searchProjects, searchByNickname } from "@/api/search";

const ITEMS_PER_PAGE = 10;

export const useSearch = () => {
  const [searchParams] = useSearchParams();
  const {
    searchTerm,
    searchResults,
    loading,
    hasMore,
    currentPage,
    setSearchTerm,
    setSearchResults,
    appendSearchResults,
    setLoading,
    setHasMore,
    setCurrentPage,
    resetSearch,
  } = useSearchStore();

  const executeSearch = useCallback(
    async (page: number) => {
      try {
        let results;
        const searchConfig = {
          page,
          size: ITEMS_PER_PAGE,
        };

        if (searchTerm.startsWith("@")) {
          results = await searchByNickname({
            ...searchConfig,
            nickname: searchTerm.slice(1),
          });
        } else {
          results = await searchProjects({
            ...searchConfig,
            title: searchTerm,
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
    ]
  );

  useEffect(() => {
    const term = searchParams.get("q") || "";
    resetSearch();
    setSearchTerm(term);

    if (term) {
      setLoading(true);
      executeSearch(0).catch((error) => {
        console.error("Initial search failed:", error);
        setLoading(false);
      });
    }
  }, [searchParams, executeSearch, resetSearch, setLoading, setSearchTerm]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      executeSearch(currentPage + 1);
    }
  }, [loading, hasMore, currentPage, executeSearch]);

  return {
    searchTerm,
    searchResults,
    loading,
    hasMore,
    loadMore,
    resetSearch,
  };
};
