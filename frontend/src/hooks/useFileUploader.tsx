import { useState } from 'react';

export type UploadState = 'none' | 'uploading' | 'error' | 'success';

export const useFileUploader = () => {
  const [uploadState, setUploadState] = useState<UploadState>('none');

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    setUploadState('uploading');

    try {
      setUploadState('success');
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadState('error');
    } finally {
      setTimeout(() => {
        setUploadState('none');
      }, 3000);
    }
  };

  return { uploadFile, uploadState };
};
