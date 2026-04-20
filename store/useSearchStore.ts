import { create } from "zustand";
import { Category, SortOption, SortOrder, FilterState } from "../types";

interface SearchStore extends FilterState {
  setSearchQuery: (query: string) => void;
  setCategory: (category: Category | "All") => void;
  setSortBy: (sortBy: SortOption) => void;
  toggleSortOrder: () => void;
  reset: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchQuery: "",
  category: "All",
  sortBy: "HighCaffeine",
  sortOrder: "desc",

  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategory: (category) => set({ category }),
  setSortBy: (sortBy) => set({ sortBy }),
  toggleSortOrder: () =>
    set((state) => ({ sortOrder: state.sortOrder === "asc" ? "desc" : "asc" })),
  reset: () =>
    set({
      searchQuery: "",
      category: "All",
      sortBy: "HighCaffeine",
      sortOrder: "desc",
    }),
}));
