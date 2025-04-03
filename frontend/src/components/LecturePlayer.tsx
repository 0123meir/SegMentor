import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import FileDropZone from "./FileDropZone";
import { useFileUploader } from "@/hooks/useFileUploader";

const LecturePlayer = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);

  const { uploadFile, isUploading } = useFileUploader()

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

  useEffect(()=>{
    if (audioFile) {
      console.log("start upload of ", audioFile)
      uploadFile(audioFile)
    }
  },[audioFile])

  return (
    <div className="flex flex-grow m-2 gap-1" style={{height: '80rem'}}>
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

      {isUploading && <div id="toast-simple" className="absolute flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:divide-gray-700 dark:bg-gray-800" role="alert">
    <svg className="w-5 h-5 text-blue-600 dark:text-blue-500 rotate-45" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 17 8 2L9 1 1 19l8-2Zm0 0V9"/>
    </svg>
    <div dir="ltr" className="ps-4 text-sm font-normal">Upload in progress...</div>
</div>}
    </div>
  );
};

export default LecturePlayer;
