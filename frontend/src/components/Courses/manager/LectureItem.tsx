import CircularProgress from '@/components/common/CircularProgress';
import { usePolling } from '@/hooks/usePolling';
import { useCoursesStore } from '@/state/CoursesStore';
import { Lecture, LectureStatus } from '@/types/Course';
import { useCallback } from 'react';

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

  //   const pollingInterval = useRef<NodeJS.Timeout | null>(null);
  //   const pollingTimeout = useRef<NodeJS.Timeout | null>(null);

  //   useEffect(() => {
  //     if (isUploadInProgress) {
  //       pollingInterval.current = setInterval(() => {
  //         pollInProgressLecture(courseIndex, lecture._id!, lectureIndex);
  //       }, POLL_INTERVAL_MS);

  //       pollingTimeout.current = setTimeout(() => {
  //         if (pollingInterval.current) {
  //           clearInterval(pollingInterval.current);
  //           pollingInterval.current = null;
  //         }
  //       }, POLL_TIMEOUT_MS);
  //     }

  //     return () => {
  //       if (pollingInterval.current) {
  //         clearInterval(pollingInterval.current);
  //       }

  //       if (pollingTimeout.current) {
  //         clearTimeout(pollingTimeout.current);
  //       }
  //     };
  //   }, [
  //     courseIndex,
  //     isUploadInProgress,
  //     lecture._id,
  //     lectureIndex,
  //     pollInProgressLecture,
  //   ]);

  return (
    <li className="flex items-center p-3 border-b border-gray-200 last:border-b-0">
      <span className="flex-1 min-w-0 break-words max-w-xs">
        {lecture.title}
      </span>
      {isUploadInProgress ? (
        <div className="flex gap-2 items-center">
          <span>Uploading</span>
          <CircularProgress className="w-4 h-4" />
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(courseIndex, lectureIndex)}
            className="bg-blue-500 text-white border-none py-3 px-6 rounded-md cursor-pointer text-base hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(courseIndex, lectureIndex)}
            className="bg-red-500 text-white border-none py-3 px-6 rounded-md cursor-pointer text-base hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </li>
  );
};

export default LectureItem;
