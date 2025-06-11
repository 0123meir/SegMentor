import { useCoursesStore } from '@/state/CoursesStore';
import { Course } from '@/types/Course';
import { detectTextDirection } from '@/utils/detectTextDirection';
import { BiBook } from 'react-icons/bi';

import { CourseItem } from './CourseItem';

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

  const handleCourseClick = (courseId: string) => {
    setActiveCourse(courseId);
  };

  const handleLectureClick = async (courseId: string, lectureId: string) => {
    // set the lecture as active
    setActiveLecture(lectureId);

    // Delegate to hook for optimistic update and API call
    await markLectureWatched(courseId, lectureId);
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

  if (!courses || (courses && courses.length === 0)) {
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
        {courses?.map((course: Course) => {
          // Filter out lectures with status "Done"
          const filteredCourse = {
            ...course,
            lectures: course.lectures.filter(
              (lecture) => lecture.status === 'Done'
            ),
          };

          return (
            <CourseItem
              key={course._id}
              course={filteredCourse}
              activeLecture={activeLectureId}
              onClick={() => handleCourseClick(course._id)}
              isActive={activeCourseId === course._id}
              onLectureClick={(lectureId) =>
                handleLectureClick(course._id, lectureId)
              }
            />
          );
        })}
      </div>
    </div>
  );
};
