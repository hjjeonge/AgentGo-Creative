import { create } from "zustand";

interface ColorHistoryState {
  recentColors: string[];
  addRecentColor: (value: string) => void;
}

const normalizeHex = (value: string) => {
  if (!value) return "#000000";
  if (value === "transparent") return "transparent";
  return value.startsWith("#") ? value.toUpperCase() : `#${value}`.toUpperCase();
};

export const useColorHistoryStore = create<ColorHistoryState>((set) => ({
  recentColors: [],
  addRecentColor: (value: string) =>
    set((state) => {
      const normalized = normalizeHex(value);
      const next = [normalized, ...state.recentColors.filter((c) => c !== normalized)];
      return { recentColors: next.slice(0, 7) };
    }),
}));
