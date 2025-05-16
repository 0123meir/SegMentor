import { create } from 'zustand';

interface User {
  _id: string;
  username: string;
  role: string;
}

interface AuthState {
  token: string;
  user: User | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: '',
  user: null,
  setToken: (token) => set({ token }),
  clearToken: () => set({ token: '' }),
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export default useAuthStore;
