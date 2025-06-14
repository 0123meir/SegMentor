import CircularProgress from '@/components/common/CircularProgress';
import { usePolling } from '@/hooks/usePolling';
import { useCoursesStore } from '@/state/CoursesStore';
import { Lecture, LectureStatus } from '@/types/Course';
import { useCallback } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

interface LectureItemProps {
  lecture: Partial<Lecture>;
  lectureIndex: number;
  onEdit: (courseIndex: number, lectureIndex: number) => void;
  onDelete: (courseIndex: number, lectureIndex: number) => void;
  courseIndex: number;
}

const POLL_INTERVAL_MS = 5_000;
const POLL_TIMEOUT_MS = 120_000;

const LectureItem = ({
  lecture,
  lectureIndex,
  courseIndex,
  onDelete,
  onEdit,
}: LectureItemProps) => {
  const getExistingLecture = useCoursesStore(
    (state) => state.getExistingLecture
  );

  const isUploadInProgress = lecture.status === LectureStatus.IN_PROGRESS;

  const pollLecture = useCallback(() => {
    getExistingLecture(courseIndex, lecture._id!, lectureIndex);
  }, [courseIndex, lecture._id, lectureIndex, getExistingLecture]);

  usePolling({
    intervalMS: POLL_INTERVAL_MS,
    timeoutMS: POLL_TIMEOUT_MS,
    onCondition: isUploadInProgress,
    pollFunction: pollLecture,
  });

  return (
    <li className="flex items-center justify-between py-1.5 px-2 border-b border-gray-200 last:border-b-0 text-sm">
      <span className="flex-1 min-w-0 break-words max-w-[60%] truncate">
        {lecture.title}
      </span>
      {isUploadInProgress ? (
        <div className="flex gap-1 items-center ml-auto">
          <span className="text-xs">Uploading</span>
          <CircularProgress className="w-3 h-3" />
        </div>
      ) : (
        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => onEdit(courseIndex, lectureIndex)}
            className="p-1 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit lecture"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(courseIndex, lectureIndex)}
            className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Delete lecture"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      )}
    </li>
  );
};

export default LectureItem;
