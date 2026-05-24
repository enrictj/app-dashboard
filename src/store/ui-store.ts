import { create } from "zustand";

type UiState = {
  sidebarCollapsed: boolean;
  searchQuery: string;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
};

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  searchQuery: "",
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () =>
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
