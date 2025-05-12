import { useCoursesStore } from '@/state/CoursesStore';
import { Course } from '@/types/Course';
import { BiBook } from 'react-icons/bi';

import { detectTextDirection } from '@/utils/detectTextDirection';
import { CourseItem } from './sidebar/CourseItem';

export const CourseList = () => {
  const {
    courses,
    isLoading,
    error,
    markLectureWatched,
    activeCourseId,
    activeLectureId,
    setActiveCourse,
    setActiveLecture,
  } = useCoursesStore();

  const sectionName = 'My Courses';

  const handleCourseClick = (course: Course) => {
    setActiveCourse(course._id);
  };

  const handleLectureClick = async (courseId: string, lectureIndex: number) => {
    const course = courses.find((c) => c._id === courseId);
    if (!course) return;

    const lecture = course.lectures[lectureIndex];
    if (!lecture) return;

    // set the lecture as active
  setActiveLecture(lecture._id!);

    // TODO: navigate to the lecture

    // Delegate to hook for optimistic update and API call
    await markLectureWatched(courseId, lecture._id!);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center text-gray-600">
        Loading courses...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center text-gray-600">
        <p className="mb-2">No courses found.</p>
        <p className="text-sm">
          If you believe you should have access to some courses, please contact
          your administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
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
            key={course._id}
            course={course}
            activeLecture={activeLectureId}
            onClick={() => handleCourseClick(course)}
            isActive={activeCourseId === course._id}
            onLectureClick={(index) => handleLectureClick(course._id, index)}
          />
        ))}
      </div>
    </div>
  );
};
