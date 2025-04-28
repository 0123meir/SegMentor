import AddCourseForm from '@/components/courses/manager/AddCourseForm';
import CourseCard from '@/components/courses/manager/CourseCard';
import { useCourses } from '@/hooks/useCourses';
import { useCoursesStore } from '@/state/CoursesStore';
import { useEffect, useState } from 'react';

const CoursesManagerPage = () => {
  const { courses, fetchCourses } = useCourses();
  const { setCourses } = useCoursesStore();

  const [currentCourse, setCurrentCourse] = useState<string>('');
  const [lectureTitles, setLectureTitles] = useState<{ [key: number]: string }>(
    {}
  );

  useEffect(() => {
    //this is not good at all, but it works for now I need to change the whole behavior of hook and store
    fetchCourses();
  }, []);

  useEffect(() => {
    setCourses(courses);
  }, []);

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
