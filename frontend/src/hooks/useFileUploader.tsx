import { useVideoPlayerStore } from '@/state/VideoPlayerStore';
import { Segment } from '@/types/Segment';
import { SegmentDto } from '@/types/dtos/SegmentDto';
import { segmentsColors } from '@/utils/Colors';
import { timeToSeconds } from '@/utils/Time';
import axios from 'axios';
import { useEffect, useState } from 'react';

export type UploadState = 'none' | 'uploading' | 'error' | 'success';

export const useFileUploader = () => {
  const [uploadState, setUploadState] = useState<UploadState>('none');

  useEffect(() => {
    console.log(uploadState);
  }, [uploadState]);
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
