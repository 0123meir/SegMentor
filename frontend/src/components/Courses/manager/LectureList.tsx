import { Lecture } from '@/types/Course';

import LectureItem from './LectureItem';

interface LectureListProps {
  lectures: Partial<Lecture>[];
  onEdit: (courseIndex: number, lectureIndex: number) => void;
  onDelete: (courseIndex: number, lectureIndex: number) => void;
  courseIndex: number;
}

const LectureList = ({
  lectures,
  onEdit,
  onDelete,
  courseIndex,
}: LectureListProps) => (
  <ul className="list-none p-0">
    {lectures.length > 0 ? (
      lectures.map((lecture, lectureIndex) => (
        <LectureItem
          key={`${lecture._id}-${lectureIndex}`}
          courseIndex={courseIndex}
          onDelete={onDelete}
          onEdit={onEdit}
          lecture={lecture}
          lectureIndex={lectureIndex}
        />
      ))
    ) : (
      <li className="flex items-center p-3">No lectures added yet.</li>
    )}
  </ul>
);

export default LectureList;
