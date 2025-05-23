import { useEffect, useState } from 'react';

import VideoPlayer from './VideoPlayer';
import { useCoursesStore } from '@/state/CoursesStore';
import { useSegmentsStore } from '@/state/SegmentsStore';
import useAuthStore from '@/stores/AuthStore';

const LecturePlayer = () => {
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const {activeLectureId} = useCoursesStore()
  const {setSegments} = useSegmentsStore()
  const {token} = useAuthStore();

  useEffect(() => {
    const onActiveLectureChange = async () => {
        if (activeLectureId) {
          setVideoUrl(`${import.meta.env.VITE_CLOUDFRONT_DOMAIN_URL}/${activeLectureId}.mp4`)
          setSegments([])
        }
      }

      onActiveLectureChange()
  }, [activeLectureId, token, setSegments]);

  return (
    <div className="flex flex-grow m-2 gap-1" style={{ height: '80rem' }}>
      {videoUrl ? (
        <VideoPlayer url={videoUrl} />
      ): <>No Lecture Selected!</>}
    </div>
  );
};

export default LecturePlayer;
