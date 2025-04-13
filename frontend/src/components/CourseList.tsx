import { useCoursesStore } from "@/state/CoursesStore";
import { useState } from "react";
import { BiBook } from "react-icons/bi";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";

import { detectTextDirection } from "../utils/detectTextDirection";
import { Course } from "@/types/Course";

export const CourseList = () => {
  const {courses} = useCoursesStore();
  const sectionName = "My Courses";

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div
        className="flex items-center gap-2 mb-6"
        style={{ direction: detectTextDirection(sectionName) }}
      >
        <BiBook className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">{sectionName}</h2>
      </div>
      <div className="space-y-3">
        {courses.map((course: Course) => (
          <CourseItem key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

const CourseItem = ({
  course,
}: {
  course: {
    id: string;
    name: string;
    lectures: string[];
    currentLecture: number;
  };
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white">
      <div
        className="cursor-pointer p-4 rounded-lg flex justify-between items-center group"
        onClick={() => setIsOpen(!isOpen)}
        style={{ direction: detectTextDirection(course.name) }}
      >
        <div className="space-y-1">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
            {course.name}
          </h3>
          <p className="text-sm text-gray-600">
            Lecture {course.currentLecture + 1} of {course.lectures.length}
          </p>
        </div>
        {isOpen ? (
          <IoChevronUpOutline className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
        ) : (
          <IoChevronDownOutline className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
        )}
      </div>

      {isOpen && (
        <div className="border-t border-gray-100">
          <ul
            className="divide-y divide-gray-100"
            style={{ direction: detectTextDirection(course.lectures[0]) }}
          >
            {course.lectures.map((lecture, index) => (
              <li
                key={index}
                className={`p-3 hover:bg-gray-50 transition-colors duration-150 ${
                  index === course.currentLecture
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700"
                }`}
              >
                <div className="flex items-center">
                  <span className="w-8 text-sm text-gray-500">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  {lecture}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
