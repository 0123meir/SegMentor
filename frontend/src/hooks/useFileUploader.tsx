import { useSegmentsStore } from '@/state/SegmentsStore';
import { Segment } from '@/types/Segment';
import { SegmentDto } from '@/types/dtos/SegmentDto';
import { segmentsColors } from '@/utils/Colors';
import { timeToSeconds } from '@/utils/Time';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { GATEWAY_URL } from '@/globals/urls.tsx';
import Cookies from 'js-cookie';


export type UploadState = 'none' | 'uploading' | 'error' | 'success';

export const useFileUploader = () => {
  const [uploadState, setUploadState] = useState<UploadState>('none');
  const { setSegments } = useSegmentsStore();

  useEffect(() => {
    console.log(uploadState);
  }, [uploadState]);
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
      const response = await axios.post(
        `${GATEWAY_URL}/video-initializer/extract-mp3`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('authToken')}`,
          },
        }
      );

      // for now the service does not return segments
      const segments: SegmentDto[] = response.data.segments.segments;

      console.log('Upload successful:', segments);

      const segmentsForTimeline: Segment[] = segments.map(
        (segment: SegmentDto, index: number) => ({
          ...segment,
          color: segmentsColors[index % segmentsColors.length],
          description: segment.summary,
          start: timeToSeconds(segment.start),
          end: timeToSeconds(segment.end),
        })
      );

      setSegments(segmentsForTimeline);
      setUploadState('success');
      return segments;
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
