import { useApi } from '@/hooks/useApi';
import { useCoursesStore } from '@/state/CoursesStore';
import { useVideoPlayerStore } from '@/state/VideoPlayerStore';
import { useEffect } from 'react';

import VideoPlayer from './VideoPlayer';
import LoadingVideoPlayer from './LoadingVideoPlayer';

const LecturePlayer = () => {
  const {activeLectureId} = useCoursesStore()

  const {
    initState,
    fetchVideoData,
    videoError,
    segments,
    videoUrl,
    isVideoLoading,
  } = useVideoPlayerStore();

  const api = useApi();
  useEffect(() => {

    if (activeLectureId) {
      initState(api);
      fetchVideoData(activeLectureId);
    }
  }, [activeLectureId]);

  if (isVideoLoading) {
    return <LoadingVideoPlayer />;
  }

  if (videoError) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500">{videoError}</p>
      </div>
    );
  }

  return videoUrl && <VideoPlayer url={videoUrl} segments={segments ?? []} />;

};

export default LecturePlayer;
