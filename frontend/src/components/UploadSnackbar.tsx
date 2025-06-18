import { ReactNode } from 'react';
import { BiCheck, BiError } from 'react-icons/bi';
import { UploadState } from '@/context/SnackbarContext.tsx';
import CircularProgress from './common/CircularProgress';

interface UploadSnackbarProps {
  uploadState: UploadState;
  title: string
}

const UploadSnackbar = ({ uploadState, title }: UploadSnackbarProps) => {
  const uploadStateToMessage: Record<UploadState, string> = {
    uploading: 'Upload in progress...',
    error: 'Failed to upload files to the server',
    success: 'Uploaded file to the server!',
    none: '',
  };

  const uploadStateToIcon: Record<UploadState, ReactNode> = {
    uploading: <CircularProgress />,
    error: <BiError className="text-red-500" />,
    success: <BiCheck className="text-green-500" />,
    none: <></>,
  };

  return (
    uploadState !== 'none' && (
      <div
        dir="ltr"
        id="toast-simple"
        className="flex items-center p-4 space-x-4 rtl:space-x-reverse bg-gray-50 rounded-lg shadow-sm text-gray-900"
        role="alert"
      >
        { title }
        {uploadStateToIcon[uploadState]}
        <div className="ps-4 text-sm font-normal text-start">
          {uploadStateToMessage[uploadState]}
        </div>
      </div>
    )
  );
};

export default UploadSnackbar;
