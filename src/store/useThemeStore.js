import { create } from "zustand";
import { DEFAULT_THEME, THEME_IDS } from "../constants";

// A theme that was removed from the curated list may still be in localStorage
// from an earlier visit, so fall back rather than applying an unknown one.
const storedTheme = () => {
  const saved = localStorage.getItem("ConnectMedic-theme");
  return THEME_IDS.includes(saved) ? saved : DEFAULT_THEME;
};

export const useThemeStore = create((set) => ({
  theme: storedTheme(),
  setTheme: (theme) => {
    localStorage.setItem("ConnectMedic-theme", theme);
    set({ theme });
  },
}));
