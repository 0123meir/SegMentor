import { create } from 'zustand';

interface AuthState {
  token: string;
  setToken: (token: string) => void;
  clearToken: () => void;
}

const useAuthStore = create<AuthState>((set) => {
  const storedToken = localStorage.getItem('auth_token') || '';

  return {
    token: storedToken,
    setToken: (token: string) => {
      localStorage.setItem('auth_token', token);
      set({ token });
    },
    clearToken: () => {
      localStorage.removeItem('auth_token');
      set({ token: '' });
    },
  };
});

export default useAuthStore;
