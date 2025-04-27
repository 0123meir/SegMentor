import { useCoursesStore } from '@/state/CoursesStore';
import { useState } from 'react';

const CoursesManagerPage = () => {
  const { courses, setCourses } = useCoursesStore();
  const [currentCourse, setCurrentCourse] = useState<string>('');
  const [lectureTitle, setLectureTitle] = useState<string>('');

  // TODO: Replace with actual auth
  const mockLecturerId = 'lecturer123';
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

  const handleAddLecture = (courseIndex: number): void => {
    if (lectureTitle.trim()) {
      const updatedCourses = [...courses];
      updatedCourses[courseIndex].lectures.push({
        _id: Date.now().toString(),
        title: lectureTitle,
        date: new Date().toISOString(),
      });
      setCourses(updatedCourses);
      setLectureTitle('');
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
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <input
            type="text"
            value={currentCourse}
            onChange={(e) => setCurrentCourse(e.target.value)}
            placeholder="Enter course name"
            className="w-full p-3 border border-gray-300 rounded-md mb-4 text-base"
          />
          <button
            onClick={handleAddCourse}
            className="bg-blue-500 text-white border-none py-3 px-6 rounded-md cursor-pointer text-base hover:bg-blue-600"
          >
            Add Course
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map((course, courseIndex) => (
          <div key={course._id} className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-[#2c3e50] mb-4 text-xl font-semibold">
              {course.name}
            </h3>
            <button
              onClick={() => {
                /* TODO: Navigate to lecture upload page */
              }}
              className="w-full bg-green-500 text-white border-none py-3 px-6 rounded-md cursor-pointer text-base hover:bg-green-600 mb-4"
            >
              Upload New Lecture
            </button>
            {isAdmin && (
              <>
                <input
                  type="text"
                  value={lectureTitle}
                  onChange={(e) => setLectureTitle(e.target.value)}
                  placeholder="Enter lecture title"
                  className="w-full p-3 border border-gray-300 rounded-md mb-4 text-base"
                />
                <button
                  onClick={() => handleAddLecture(courseIndex)}
                  className="bg-blue-500 text-white border-none py-3 px-6 rounded-md cursor-pointer text-base hover:bg-blue-600"
                >
                  Add Lecture
                </button>
              </>
            )}
            <ul className="list-none p-0">
              {course.lectures.length > 0 ? (
                course.lectures.map((lecture, lectureIndex) => (
                  <li
                    key={lecture._id}
                    className="flex items-center p-3 border-b border-gray-200 last:border-b-0"
                  >
                    <span className="flex-1">{lecture.title}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleEditLecture(courseIndex, lectureIndex)
                        }
                        className="bg-blue-500 text-white border-none py-3 px-6 rounded-md cursor-pointer text-base hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteLecture(courseIndex, lectureIndex)
                        }
                        className="bg-red-500 text-white border-none py-3 px-6 rounded-md cursor-pointer text-base hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li className="flex items-center p-3">
                  No lectures added yet.
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesManagerPage;
