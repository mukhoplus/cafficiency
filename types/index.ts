export type Category = "Franchise" | "Mix";

export interface SizeOption {
  sizeName: string;
  volume: string;
  caffeine: number; // in mg
  price: number; // in KRW
}

export interface Drink {
  id: string;
  brand: string;
  name: string;
  category: Category;
  sizes: SizeOption[];
}

export type SortOption = "HighCaffeine" | "LowPrice" | "BestEfficiency";

export interface FilterState {
  searchQuery: string;
  category: Category | "All";
  sortBy: SortOption;
}
