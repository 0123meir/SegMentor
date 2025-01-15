import { useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { AIAssistant } from "@/components/AIAssistant";
import { Collections } from "@/components/Collections";

const App = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // handle file drop or manual upload
  const handleFileUpload = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileUpload,
    accept: "video/*" as unknown as Accept,
  });

  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col flex-grow justify-center m-2">
          {!videoFile && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Upload and Play Video</h1>

              <div
                {...getRootProps({
                  className:
                    "upload-area border-2 border-dashed border-green-500 p-10 bg-green-50 text-center rounded-lg cursor-pointer transition hover:bg-green-100",
                })}
              >
                <input {...getInputProps()} />
                <p className="mb-2 text-gray-600">
                  Drag & Drop your video here or
                </p>
                <button className="upload-button px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                  Browse Files
                </button>
              </div>
            </div>
          )}

          {videoUrl && (
            <div className="video-player">
              <video className="w-full rounded-md" controls>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        <AIAssistant/>
          <p className="text-xl">AI Assistant</p>
        </div>
      </div>

      <Collections/>
        <p className="text-xl">Collections</p>
      </div>
    </div>
  );
};

export default App;
