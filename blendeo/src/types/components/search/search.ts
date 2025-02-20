// src/types/components/search/search.ts
import { SearchProjectResponse } from "@/types/api/search";
export interface SearchState {
  searchTerm: string;
  searchResults: SearchProjectResponse[];
  loading: boolean;
  hasMore: boolean;
  currentPage: number;
}

export interface SearchActions {
  setSearchTerm: (term: string) => void;
  setSearchResults: (results: SearchProjectResponse[]) => void;
  appendSearchResults: (results: SearchProjectResponse[]) => void;
  setLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setCurrentPage: (page: number) => void;
  resetSearch: () => void;
}
