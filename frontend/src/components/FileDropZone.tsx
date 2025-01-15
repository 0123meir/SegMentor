import { useState } from "react";
import { Accept, useDropzone } from "react-dropzone";

const FileDropZone = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null); // Store video file
  const [audioFile, setAudioFile] = useState<File | null>(null); // Store audio file
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined); // Store video URL
  const [_audioUrl, setAudioUrl] = useState<string | undefined>(undefined); // Store audio URL

  // Handle file drop or manual upload
  const handleFileUpload = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (file.type.startsWith("video/") && !videoFile) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
    } else if (file.type.startsWith("audio/") && videoFile && !audioFile) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileUpload,
    accept: "video/mp4, audio/mp3" as unknown as Accept
  });

  return (
    <div className="flex flex-col flex-grow m-2">
      {!videoFile && (
        <div className="flex flex-col text-center flex-grow">
          <h1 className="text-2xl font-bold mb-4">Upload Lecture Video (.mp4)</h1>
          <div
            {...getRootProps({
              className:
                "upload-area border-2 border-dashed border-green-500 p-10 bg-green-50 text-center rounded-lg cursor-pointer transition hover:bg-green-100 content-center flex-grow",
            })}
          >
            <input {...getInputProps()} />
            <p className="mb-2 text-gray-600">
              Drag & Drop your video file (.mp4) here or
            </p>
            <button className="upload-button px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              Browse Files
            </button>
          </div>
        </div>
      )}

      {videoFile && !audioFile && (
        <div className="flex-grow flex flex-col text-center">
          <h1 className="text-2xl font-bold mb-4">Upload Lecture Audio (.mp3)</h1>
          <div
            {...getRootProps({
              className:
                "upload-area border-2 border-dashed border-blue-500 p-10 bg-blue-50 text-center rounded-lg cursor-pointer transition hover:bg-blue-100 content-center flex-grow",
            })}
          >
            <input {...getInputProps()} />
            <p className="mb-2 text-gray-600">
              Drag & Drop your audio file (.mp3) here or
            </p>
            <button className="upload-button px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Browse Files
            </button>
          </div>
        </div>
      )}

      {videoFile && audioFile && (
        <div className="video-player mb-4">
          <video className="w-full rounded-md" controls>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default FileDropZone;
