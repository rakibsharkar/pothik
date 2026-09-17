'use client';

import { create } from 'zustand';

export type Language = 'bn' | 'en';

interface LangState {
  lang: Language;
  toggleLang: () => void;
  setLang: (lang: Language) => void;
  t: (bn: string, en: string) => string;
}

export const useLangStore = create<LangState>((set, get) => ({
  lang: 'bn',
  toggleLang: () =>
    set((state) => {
      const next = state.lang === 'bn' ? 'en' : 'bn';
      if (typeof window !== 'undefined') {
        localStorage.setItem('pothik-lang', next);
      }
      return { lang: next };
    }),
  setLang: (lang: Language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pothik-lang', lang);
    }
    set({ lang });
  },
  t: (bn: string, en: string) => (get().lang === 'bn' ? bn : en),
}));
