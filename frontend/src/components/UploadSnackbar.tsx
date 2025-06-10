import { ReactNode } from 'react';
import { BiCheck, BiError } from 'react-icons/bi';
import { UploadState } from '@/context/SnackbarContext.tsx';
import CircularProgress from './common/CircularProgress';

interface UploadSnackbarProps {
  uploadState: UploadState;
}

const UploadSnackbar = (props: UploadSnackbarProps) => {
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
    props.uploadState !== 'none' && (
      <div
        dir="ltr"
        id="toast-simple"
        className="absolute bottom-0 m-4 flex items-center p-4 space-x-4 rtl:space-x-reverse text-gray-50 bg-white rounded-lg shadow-sm dark:text-gray-900 light:bg-gray-800"
        role="alert"
      >
        {uploadStateToIcon[props.uploadState]}
        <div className="ps-4 text-sm font-normal text-start">
          {uploadStateToMessage[props.uploadState]}
        </div>
      </div>
    )
  );
};

export default UploadSnackbar;
