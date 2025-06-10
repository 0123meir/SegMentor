import { createContext, useContext, useState, ReactNode } from 'react';

export type UploadState = 'none' | 'uploading' | 'error' | 'success';

interface SnackbarContextProps {
  uploadState: UploadState | null;
  showSnackbar: (state: UploadState) => void;
  fadeSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [uploadState, setUploadState] = useState<UploadState | null>(null);

  const showSnackbar = (state: UploadState) => setUploadState(state);
  const fadeSnackbar = () => {
    setTimeout(() => {
      setUploadState('none');
    }, 8000);
  };

  return (
    <SnackbarContext.Provider value={{ uploadState, showSnackbar, fadeSnackbar }}>
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};