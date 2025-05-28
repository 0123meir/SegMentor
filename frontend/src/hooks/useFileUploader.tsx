import axios from 'axios';
import { useState } from 'react';
import { GATEWAY_URL } from '@/globals/urls.tsx';
import Cookies from 'js-cookie';


export type UploadState = 'none' | 'uploading' | 'error' | 'success';

export const useFileUploader = () => {
  const [uploadState, setUploadState] = useState<UploadState>('none');

  const uploadFile = async (file: File | null, courseId: string, title: string) => {
    if (!file) {
      setUploadState('error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('courseId', courseId);

    setUploadState('uploading');

    try {
      await axios.post(
        `${GATEWAY_URL}/video-initializer/extract-mp3`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('authToken')}`,
          },
        }
      );

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
