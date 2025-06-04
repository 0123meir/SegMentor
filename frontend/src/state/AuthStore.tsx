import { create } from 'zustand';

export enum UserRoles {
    Student = 'student',
    Lecturer = 'lecturer',
    Admin = 'admin',
}
interface User {
  id: string;
  username: string;
  role: UserRoles;
}
interface UserDTO {
  id: string;
  username: string;
  role: string;
}
interface AuthState {
  token: string;
  user: User | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  setUser: (user: UserDTO) => void;
  clearState: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: '',
  user: null,
  setToken: (token) => set({ token }),
  clearToken: () => set({ token: '' }),
  setUser: (user) => set({ user: { ...user, role: user.role as UserRoles } }),
  clearState: () => set({ token: '', user: null })
}));

export default useAuthStore;
