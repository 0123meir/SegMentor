import { useFileUploader } from '@/hooks/useFileUploader';
import { useEffect, useState } from 'react';

import FileDropZone from './FileDropZone';
import UploadSnackbar from './UploadSnackbar';
import VideoPlayer from './VideoPlayer';

const LecturePlayer = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);

  const { uploadFile, uploadState } = useFileUploader();

  const handleFileUpload = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (file.type.startsWith('video/') && !videoFile) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (videoFile) {
      console.log('start upload of ', videoFile);
      uploadFile(videoFile);
    }
  }, [videoFile]);

  return (
    <div className="flex flex-grow m-2 gap-1" style={{ height: '80rem' }}>
      {!videoFile && (
        <FileDropZone
          dropZoneOptions={{
            accept: { 'video/mp4': ['.mp4'] },
            onDrop: handleFileUpload,
          }}
        />
      )}

      {videoFile && videoUrl && (
        <VideoPlayer url={videoUrl} />
      )}

      <UploadSnackbar uploadState={uploadState} />
    </div>
  );
};

export default LecturePlayer;
