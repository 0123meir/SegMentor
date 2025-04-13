import { useCoursesStore } from "@/state/CoursesStore";
import { Course } from "@/types/Course";
import { BiBook } from "react-icons/bi";

import { detectTextDirection } from "../../utils/detectTextDirection";
import { CourseItem } from "./CourseItem";

export const CourseList = () => {
  const { courses, activeCourseId, setActiveCourse, setCurrentLecture } =
    useCoursesStore();
  const sectionName = "My Courses";

  const handleCourseClick = (course: Course) => {
    setActiveCourse(course.id);
  };

  const handleLectureClick = (courseId: string, lectureIndex: number) => {
    setCurrentLecture(courseId, lectureIndex);
  };

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
          <CourseItem
            key={course.id}
            course={course}
            onClick={() => handleCourseClick(course)}
            isActive={activeCourseId === course.id}
            onLectureClick={(index) => handleLectureClick(course.id, index)}
          />
        ))}
      </div>
    </div>
  );
};
