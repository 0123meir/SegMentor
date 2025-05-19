import { create } from 'zustand';

interface AuthState {
  token: string;
  setToken: (token: string) => void;
  clearToken: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: '',
  setToken: (token) => set({ token }),
  clearToken: () => set({ token: '' }),
}));

export default useAuthStore;
