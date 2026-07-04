import { create } from "zustand";

type UiState = {
  commandMenuOpen: boolean;
  setCommandMenuOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  commandMenuOpen: false,
  setCommandMenuOpen: (open) => set({ commandMenuOpen: open }),
}));
