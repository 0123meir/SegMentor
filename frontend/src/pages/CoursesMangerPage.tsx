import noPermission from '@/assets/no-permission.jpg';
import AddCourseForm from '@/components/Courses/manager/AddCourseForm';
import CourseCard from '@/components/Courses/manager/CourseCard';
import { useApi } from '@/hooks/useApi';
import useAuthStore, { UserRoles } from '@/state/AuthStore';
import { useCoursesStore } from '@/state/CoursesStore';
import { Lecture } from '@/types/Course.ts';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CoursesManagerPage = () => {
  const { token, user } = useAuthStore();
  const {
    fetchCourses,
    initState,
    courses,
    setCourses,
    isLoading,
    error,
    addLecture,
    deleteLecture,
    addCourse,
  } = useCoursesStore();

  const api = useApi();
  const navigate = useNavigate();

  const isAllowed =
    user?.role === UserRoles.Admin || user?.role === UserRoles.Lecturer;

  useEffect(() => {
    if (!isAllowed) {
      navigate('/home', { replace: true });
      return;
    }
    if (token && user && isAllowed && !courses) {
      initState(api, user.id);
      fetchCourses();
    }
  }, [user?.id, token, isAllowed]);

  const [currentCourse, setCurrentCourse] = useState<string>('');
  const [lectureTitles, setLectureTitles] = useState<{ [key: number]: string }>(
    {}
  );

  const userId = user?.id;

  const filteredCourses = useMemo(
    () =>
      courses?.filter((course) =>
        course.lecturer.find((lecturer) => lecturer._id === userId)
      ),
    [courses, userId]
  );

  const handleAddCourse = async (): Promise<void> => {
    if (currentCourse.trim() && isAllowed && userId) {
      await addCourse({
        name: currentCourse.trim(),
        lecturer: userId,
        lectures: [],
      });
      setCurrentCourse('');
      fetchCourses();
    }
  };

  const handleSetLectureTitle = (courseIndex: number, title: string) => {
    setLectureTitles((prev) => ({
      ...prev,
      [courseIndex]: title,
    }));
  };

  const handleAddLecture = (courseId: string, lecture: Lecture): void => {
    addLecture(courseId, lecture);
  };

  const handleEditLecture = (
    courseIndex: number,
    lectureIndex: number
  ): void => {
    const lecture = courses && courses[courseIndex].lectures[lectureIndex];
    const newTitle = prompt('Edit lecture title:', lecture?.title);
    if (newTitle !== null) {
      courses![courseIndex].lectures[lectureIndex].title = newTitle;
      setCourses(courses!);
    }
  };

  const handleDeleteLecture = (
    courseIndex: number,
    lectureIndex: number
  ): void => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      //TODO: use a modal
      deleteLecture(
        courses![courseIndex]._id,
        courses![courseIndex].lectures[lectureIndex]._id!
      );
    }
  };

  if (!isAllowed)
    return (
      <div className="max-w-3xl mx-auto p-4 text-center text-red-600">
        You do not have permission to access this page. Please contact an admin
        for more information.
        <img src={noPermission} alt="No permission" className="mt-10 w-200" />
      </div>
    );

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
  return (
    <div className="max-w-[1200px] mx-auto p-8" dir="ltr">
      {isAllowed && (
        <AddCourseForm
          onAdd={handleAddCourse}
          value={currentCourse}
          onChange={(e) => setCurrentCourse(e.target.value)}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses?.map((course, courseIndex) => (
          <CourseCard
            key={`${course._id}-${courseIndex}`}
            course={course}
            courseIndex={courseIndex}
            lectureTitle={lectureTitles[courseIndex] || ''}
            setLectureTitle={(title) =>
              handleSetLectureTitle(courseIndex, title)
            }
            onAddLecture={handleAddLecture}
            onEditLecture={handleEditLecture}
            onDeleteLecture={handleDeleteLecture}
          />
        ))}
      </div>
    </div>
  );
};

export default CoursesManagerPage;
