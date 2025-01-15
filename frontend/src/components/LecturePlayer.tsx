import { useState } from "react";
import VideoPlayer from "./VideoPlayer";
import FileDropZone from "./FileDropZone";

const LecturePlayer = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);

  const handleFileUpload = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (file.type.startsWith("video/") && !videoFile) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
    } else if (file.type.startsWith("audio/") && !audioFile) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col flex-grow m-2 gap-1">
      {!videoFile && (
        <FileDropZone dropZoneOptions={{
          accept: {"video/mp4": [".mp4"]},
          onDrop: handleFileUpload
        }} />
      )}

      {!audioFile && (
        <FileDropZone dropZoneOptions={{
          accept: {"audio/mp3": [".mp3"]},
          onDrop: handleFileUpload
        }} />
      )}

      {videoFile && audioFile && videoUrl && audioUrl && (
       <VideoPlayer url={videoUrl}/>
      )}
    </div>
  );
};

export default LecturePlayer;
