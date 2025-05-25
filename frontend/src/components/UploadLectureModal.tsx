import { useState } from 'react';
import FileDropZone from '@/components/FileDropZone.tsx';
import { useFileUploader } from '@/hooks/useFileUploader.tsx';
import UploadSnackbar from '@/components/UploadSnackbar.tsx';

interface LectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
}

const LectureModal = ({ isOpen, onClose, courseId }: LectureModalProps) => {
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const { uploadFile, uploadState } = useFileUploader();

  const handleSubmit = async () => {
    if (title.trim()) {
      await uploadFile(videoFile, courseId, title);

      setTitle('');
      setVideoFile(null);
      onClose();
    }
  };

  const handleFileUpload = async (acceptedFiles: File[]) => {
    const file: File = acceptedFiles[0];

    if (file.type.startsWith('video/') && !videoFile) {
      setVideoFile(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Upload Lecture</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Lecture Title"
          className="w-full p-3 border border-gray-300 rounded-md mb-4 text-base"
        />

        {(videoFile) ?
          (
            <div className="text-green-500 text-center">
              Video file selected: {videoFile.name}
            </div>
          )
          :
          (
          <FileDropZone
            dropZoneOptions={{
              accept: { 'video/mp4': ['.mp4'] },
              onDrop: handleFileUpload,
            }}
          />
        )}

        <UploadSnackbar uploadState={uploadState} />

        <br/>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black py-2 px-4 rounded-md mr-2 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`py-2 px-4 rounded-md ${
              videoFile
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!videoFile}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default LectureModal;