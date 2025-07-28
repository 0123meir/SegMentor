import { createContext, useContext, useState, ReactNode } from 'react';

export type UploadState = 'none' | 'uploading' | 'error' | 'success';
export type LectureSnackbar = { state: UploadState, title: string };

interface SnackbarContextProps {
  snackbars: { state: UploadState, title: string }[];
  createSnackbar: (title: string) => void;
  showSnackbar: (state: UploadState, title: string) => void;
  fadeSnackbar: (title: string) => void;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [snackbars, setSnackbars] = useState<LectureSnackbar[]>([]);

  const createSnackbar = (title: string) => {
    setSnackbars((prev: LectureSnackbar[]) => [...prev, { state: 'none', title }]);
  };
  const showSnackbar = (state: UploadState, title: string) => {
    setSnackbars((prev: LectureSnackbar[]) =>
      prev.map((snackbar: LectureSnackbar) =>
        snackbar.title === title ? { ...snackbar, state } : snackbar
      )
    );
  };
  const fadeSnackbar = (title: string) => {
    setTimeout(() => {
      setSnackbars((prev) => prev.filter((snackbar: LectureSnackbar) => snackbar.title !== title));
    }, 8000);
  };

  return (
    <SnackbarContext.Provider value={{ snackbars, createSnackbar, showSnackbar, fadeSnackbar }}>
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