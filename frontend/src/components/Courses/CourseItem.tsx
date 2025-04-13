import { Course } from "@/types/Course";
import { useState } from "react";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";

import { detectTextDirection } from "../../utils/detectTextDirection";

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

  const handleClick = (e: React.MouseEvent) => {
    onClick();
    setIsOpen(!isOpen);
  };

  const handleLectureClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Prevent triggering the course click
    onLectureClick?.(index);
    // Don't close the dropdown when selecting a lecture
  };

  const getCurrentLectureIndex = () => {
    return course.lectures.findIndex(
      (lecture) => course.currentLectureId === lecture.id
    );
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
            ? "ring-1 ring-blue-400 border-transparent shadow-sm"
            : "hover:shadow-sm"
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
            Lecture {getCurrentLectureIndex() + 1} of {course.lectures.length}
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
                key={lecture.id}
                onClick={(e) => handleLectureClick(e, index)}
                className={`p-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer
                  ${
                    lecture.id === course.currentLectureId
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700"
                  }
                `}
                style={{ direction: detectTextDirection(lecture.title) }}
              >
                <div className="flex items-center">
                  <span className="w-8 text-sm text-gray-500">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  {lecture.title}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
