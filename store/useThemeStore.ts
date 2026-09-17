'use client';

import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,
  toggleTheme: () =>
    set((state) => {
      const next = !state.isDark;
      if (typeof window !== 'undefined') {
        if (next) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('pothik-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('pothik-theme', 'light');
        }
      }
      return { isDark: next };
    }),
  setTheme: (isDark: boolean) => {
    if (typeof window !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('pothik-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('pothik-theme', 'light');
      }
    }
    set({ isDark });
  },
}));
