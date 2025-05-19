// import { useFileUploader } from '@/hooks/useFileUploader';
import { useEffect, useState } from 'react';

// import FileDropZone from './FileDropZone';
// import UploadSnackbar from './UploadSnackbar';
import VideoPlayer from './VideoPlayer';
import { useCoursesStore } from '@/state/CoursesStore';
import { useSegmentsStore } from '@/state/SegmentsStore';
import useAuthStore from '@/stores/AuthStore';

const LecturePlayer = () => {
  // const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const {activeLectureId} = useCoursesStore()
  const {setSegments} = useSegmentsStore()
  const {token} = useAuthStore();

  // const { uploadFile, uploadState } = useFileUploader();

  // const handleFileUpload = (acceptedFiles: File[]) => {
  //   const file = acceptedFiles[0];

  //   if (file.type.startsWith('video/') && !videoFile) {
  //     setVideoFile(file);
  //     setVideoUrl(URL.createObjectURL(file));
  //   }
  // };

  // useEffect(() => {
  //   if (videoFile) {
  //     console.log('start upload of ', videoFile);
  //     uploadFile(videoFile);
  //   }
  // }, [videoFile]);

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
      {/* {!videoFile && (
        <FileDropZone
          dropZoneOptions={{
            accept: { 'video/mp4': ['.mp4'] },
            onDrop: handleFileUpload,
          }}
        />
      )} */}

      {videoUrl ? (
        <VideoPlayer url={videoUrl} />
      ): <>No Lecture Selected!</>}

      {/* <UploadSnackbar uploadState={uploadState} /> */}
    </div>
  );
};

export default LecturePlayer;
