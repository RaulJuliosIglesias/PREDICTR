import { useAuthStore } from '../store/useAuthStore';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const balance = useAuthStore((s) => s.balance);
  const loginDemo = useAuthStore((s) => s.loginDemo);
  const logout = useAuthStore((s) => s.logout);
  return {
    user,
    balance,
    isAuthed: !!user,
    isGuest: !user,
    loginDemo,
    logout,
  };
}
