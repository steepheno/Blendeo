// src/stores/searchStore.ts
import { create } from "zustand";
import type {
  SearchState,
  SearchActions,
} from "@/types/components/search/search";

interface SearchStore extends SearchState, SearchActions {}

export const useSearchStore = create<SearchStore>((set) => ({
  searchTerm: "",
  searchResults: [],
  loading: false,
  hasMore: true,
  currentPage: 0,
  selectedInstrument: null,

  setSearchTerm: (term) => set({ searchTerm: term }),
  setSearchResults: (results) => set({ searchResults: results }),
  appendSearchResults: (results) =>
    set((state) => ({
      searchResults: [...state.searchResults, ...results],
    })),
  setLoading: (loading) => set({ loading }),
  setHasMore: (hasMore) => set({ hasMore }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedInstrument: (instrument) =>
    set({ selectedInstrument: instrument }),
  resetSearch: () =>
    set({
      searchTerm: "",
      searchResults: [],
      loading: false,
      hasMore: true,
      currentPage: 0,
      selectedInstrument: null,
    }),
}));
