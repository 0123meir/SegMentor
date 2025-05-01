import { Lecture } from '@/types/Course';
import React from 'react';

interface LectureListProps {
  lectures: Partial<Lecture>[];
  onEdit: (courseIndex: number, lectureIndex: number) => void;
  onDelete: (courseIndex: number, lectureIndex: number) => void;
  courseIndex: number;
}

const LectureList: React.FC<LectureListProps> = ({
  lectures,
  onEdit,
  onDelete,
  courseIndex,
}) => (
  <ul className="list-none p-0">
    {lectures.length > 0 ? (
      lectures.map((lecture, lectureIndex) => (
        <li
          key={`${lecture._id}-${lectureIndex}`}
          className="flex items-center p-3 border-b border-gray-200 last:border-b-0"
        >
          <span className="flex-1 min-w-0 break-words max-w-xs">
            {lecture.title}
          </span>
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
        </li>
      ))
    ) : (
      <li className="flex items-center p-3">No lectures added yet.</li>
    )}
  </ul>
);

export default LectureList;
