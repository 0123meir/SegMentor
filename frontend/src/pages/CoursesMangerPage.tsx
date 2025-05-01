import AddCourseForm from '@/components/courses/manager/AddCourseForm';
import CourseCard from '@/components/courses/manager/CourseCard';
import { useCoursesStore } from '@/state/CoursesStore';
import { useState } from 'react';

const CoursesManagerPage = () => {
  const { courses, setCourses, isLoading, error } = useCoursesStore();

  const [currentCourse, setCurrentCourse] = useState<string>('');
  const [lectureTitles, setLectureTitles] = useState<{ [key: number]: string }>(
    {}
  );

  // TODO: Replace with actual auth
  const mockLecturerId = '68037dda1cf98a948e07e10f';
  const isAdmin = true; // Will come from auth context

  const filteredCourses = courses.filter(
    (course) => isAdmin || course.lecturer._id === mockLecturerId
  );

  const handleAddCourse = (): void => {
    if (currentCourse.trim() && isAdmin) {
      setCourses([...courses]);
      setCurrentCourse('');
    }
  };

  const handleSetLectureTitle = (courseIndex: number, title: string) => {
    setLectureTitles((prev) => ({
      ...prev,
      [courseIndex]: title,
    }));
  };

  const handleAddLecture = (courseIndex: number): void => {
    const title = lectureTitles[courseIndex];
    if (title?.trim()) {
      const updatedCourses = [...courses];
      updatedCourses[courseIndex].lectures.push({
        _id: Date.now().toString(),
        title: title,
        date: new Date().toISOString(),
      });
      setCourses(updatedCourses);
      // Clear just this course's lecture title
      setLectureTitles((prev) => ({
        ...prev,
        [courseIndex]: '',
      }));
    }
  };

  const handleEditLecture = (
    courseIndex: number,
    lectureIndex: number
  ): void => {
    const lecture = courses[courseIndex].lectures[lectureIndex];
    const newTitle = prompt('Edit lecture title:', lecture.title);
    if (newTitle !== null) {
      const updatedCourses = [...courses];
      updatedCourses[courseIndex].lectures[lectureIndex].title = newTitle;
      setCourses(updatedCourses);
    }
  };

  const handleDeleteLecture = (
    courseIndex: number,
    lectureIndex: number
  ): void => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      const updatedCourses = [...courses];
      updatedCourses[courseIndex].lectures.splice(lectureIndex, 1);
      setCourses(updatedCourses);
    }
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
  return (
    <div className="max-w-[1200px] mx-auto p-8" dir="ltr">
      {isAdmin && (
        <AddCourseForm
          onAdd={handleAddCourse}
          value={currentCourse}
          onChange={(e) => setCurrentCourse(e.target.value)}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map((course, courseIndex) => (
          <CourseCard
            key={`${course._id}-${courseIndex}`}
            course={course}
            courseIndex={courseIndex}
            isAdmin={isAdmin}
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
