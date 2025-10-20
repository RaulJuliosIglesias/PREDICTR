import { create } from 'zustand';
import type { User } from '../types/user.types';

interface AuthState {
  user: User | null;
  balance: number;
  loginDemo: () => void;
  logout: () => void;
  credit: (amount: number) => void;
  debit: (amount: number) => boolean;
  setName: (name: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  balance: 0,
  loginDemo: () => set({ user: { id: 'demo', name: 'Demo User' }, balance: 5000 }),
  logout: () => set({ user: null, balance: 0 }),
  credit: (amount) => set({ balance: get().balance + amount }),
  debit: (amount) => {
    const bal = get().balance;
    if (bal >= amount) {
      set({ balance: bal - amount });
      return true;
    }
    return false;
  },
  setName: (name) => set((s) => (s.user ? { user: { ...s.user, name } } : s)),
}));
