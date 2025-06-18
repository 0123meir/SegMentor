import { create } from 'zustand';

interface KeyboardLockStore {
  inputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
}

const useKeyboardLockStore = create<KeyboardLockStore>((set) => ({
  inputFocused: false,
  setInputFocused: (focused) => set({ inputFocused: focused }),
}));

export default useKeyboardLockStore;
