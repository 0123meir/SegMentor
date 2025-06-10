import axios from 'axios';
import { useState } from 'react';
import { GATEWAY_URL } from '@/globals/urls.tsx';
import Cookies from 'js-cookie';
import { Lecture } from '@/types/Course.ts';
import { UploadState } from '@/context/SnackbarContext.tsx';


export const useFileUploader = () => {
  const [uploadState, setUploadState] = useState<UploadState>('none');

  const uploadFile = async (file: File | null, courseId: string, title: string): Promise<Lecture> => {
    if (!file) {
      throw new Error('No file selected');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('courseId', courseId);

    try {
      const { data } = await axios.post(
        `${GATEWAY_URL}/video-initializer/extract-mp3`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('authToken')}`,
          },
        }
      );

      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      return Promise.reject(error);
    } finally {
      setTimeout(() => {
        setUploadState('none');
      }, 3000);
    }
  };

  return { uploadFile, uploadState };
};
