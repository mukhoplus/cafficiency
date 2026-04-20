import { create } from "zustand";
import { Category, SortOption, FilterState } from "../types";

interface SearchStore extends FilterState {
  setSearchQuery: (query: string) => void;
  setCategory: (category: Category | "All") => void;
  setSortBy: (sortBy: SortOption) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchQuery: "",
  category: "All",
  sortBy: "HighCaffeine",

  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategory: (category) => set({ category }),
  setSortBy: (sortBy) => set({ sortBy }),
  reset: () =>
    set({ searchQuery: "", category: "All", sortBy: "HighCaffeine" }),
}));
