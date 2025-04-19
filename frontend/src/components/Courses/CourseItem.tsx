import { Course } from '@/types/Course';
import { useState } from 'react';
import { FaCircle } from 'react-icons/fa';
import { IoChevronDownOutline, IoChevronUpOutline } from 'react-icons/io5';

import { detectTextDirection } from '../../utils/detectTextDirection';

interface CourseItemProps {
  course: Course;
  onClick: () => void;
  isActive?: boolean;
  onLectureClick?: (lectureIndex: number) => void;
}

export const CourseItem = ({
  course,
  onClick,
  isActive,
  onLectureClick,
}: CourseItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    onClick();
    setIsOpen(!isOpen);
  };

  const handleLectureClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Prevent triggering the course click
    onLectureClick?.(index);
  };

  return (
    <div
      className={`
        border border-gray-100 
        rounded-lg 
        bg-white/60 
        backdrop-blur-sm 
        hover:border-gray-200
        transition-all 
        duration-200 
        ${
          isActive
            ? 'ring-1 ring-blue-400 border-transparent shadow-sm'
            : 'hover:shadow-sm'
        }
      `}
      onClick={handleClick}
      style={{ direction: detectTextDirection(course.name) }}
    >
      <div className="p-4 flex justify-between items-center group cursor-pointer">
        <div className="space-y-1">
          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            {course.name}
          </h3>
          <p className="text-sm text-gray-500">
            {course.watchedLectures.length} Lectures of {course.lectures.length}
          </p>
        </div>
        {isOpen ? (
          <IoChevronUpOutline className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
        ) : (
          <IoChevronDownOutline className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
        )}
      </div>

      {isOpen && (
        <div className="border-t border-gray-100">
          <ul className="divide-y divide-gray-100">
            {course.lectures.map((lecture, index) => (
              <li
                key={lecture._id}
                onClick={(e) => handleLectureClick(e, index)}
                className={`p-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer
                  ${
                    course.watchedLectures.includes(lecture._id)
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700'
                  }
                `}
                style={{ direction: detectTextDirection(lecture.title) }}
              >
                <div className="flex items-center justify-between cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                  <span>{lecture.title}</span>
                  {!course.watchedLectures?.includes(lecture._id) && (
                    <FaCircle className="text-gray-300 w-3 h-3" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
