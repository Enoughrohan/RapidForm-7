'use client';

import { create } from 'zustand';
import type { Service } from '@/lib/services';

export type TabPage = 'home' | 'forms' | 'completed' | 'account';
export type SchemeTab = 'central' | 'bihar';
export type CatTab = 0 | 1 | 2 | 3 | 4;
export type Lang = 'en' | 'hi';

function getSavedLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  return (localStorage.getItem('rf_lang') as Lang) || 'en';
}

interface AppState {
  activePage: TabPage;
  setActivePage: (p: TabPage) => void;
  activeCat: CatTab;
  setActiveCat: (c: CatTab) => void;
  schemeTab: SchemeTab;
  setSchemeTab: (t: SchemeTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedService: Service | null;
  openModal: (s: Service) => void;
  closeModal: () => void;
  applyModalOpen: boolean;
  applyTatkal: boolean;
  openApply: (tatkal: boolean) => void;
  closeApply: () => void;
  successRef: string | null;
  setSuccessRef: (ref: string | null) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activePage: 'home',
  setActivePage: (p) => set({ activePage: p }),
  activeCat: 0,
  setActiveCat: (c) => set({ activeCat: c }),
  schemeTab: 'central',
  setSchemeTab: (t) => set({ schemeTab: t }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  selectedService: null,
  openModal: (s) => set({ selectedService: s }),
  closeModal: () => set({ selectedService: null }),
  applyModalOpen: false,
  applyTatkal: false,
  openApply: (tatkal) => set({ applyModalOpen: true, applyTatkal: tatkal }),
  closeApply: () => set({ applyModalOpen: false }),
  successRef: null,
  setSuccessRef: (ref) => set({ successRef: ref }),
  lang: getSavedLang(),
  setLang: (l) => {
    if (typeof window !== 'undefined') localStorage.setItem('rf_lang', l);
    set({ lang: l });
  },
}));
