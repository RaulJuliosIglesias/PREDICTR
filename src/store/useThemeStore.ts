import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  set: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'dark',
  toggle: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
  set: (theme) => set({ theme }),
}));
