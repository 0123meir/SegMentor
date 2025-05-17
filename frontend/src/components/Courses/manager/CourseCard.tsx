import { Course } from '@/types/Course';
import LectureList from './LectureList';

interface CourseCardProps {
  course: Course;
  courseIndex: number;
  lectureTitle: string;
  setLectureTitle: (title: string) => void;
  onAddLecture: (courseIndex: number) => void;
  onEditLecture: (courseIndex: number, lectureIndex: number) => void;
  onDeleteLecture: (courseIndex: number, lectureIndex: number) => void;
}

const CourseCard = ({
  course,
  courseIndex,
  lectureTitle,
  setLectureTitle,
  onAddLecture,
  onEditLecture,
  onDeleteLecture,
} :CourseCardProps) => (
  <div className="bg-white rounded-lg p-6 shadow-md">
    <h3 className="text-[#2c3e50] mb-4 text-xl font-semibold">{course.name}</h3>
    <button
      onClick={() => {
        /* TODO: Navigate to lecture upload page */
      }}
      className="w-full bg-green-500 text-white border-none py-3 px-6 rounded-md cursor-pointer text-base hover:bg-green-600 mb-4"
    >
      Upload New Lecture
    </button>
    
      <>
        <input
          type="text"
          value={lectureTitle}
          onChange={(e) => setLectureTitle(e.target.value)}
          placeholder="Enter lecture title"
          className="w-full p-3 border border-gray-300 rounded-md mb-4 text-base"
        />
        <button
          onClick={() => onAddLecture(courseIndex)}
          className="bg-blue-500 text-white border-none py-3 px-6 rounded-md cursor-pointer text-base hover:bg-blue-600"
        >
          Add Lecture
        </button>
      </>
    
    <LectureList
      lectures={course.lectures}
      onEdit={onEditLecture}
      onDelete={onDeleteLecture}
      courseIndex={courseIndex}
    />
  </div>
);

export default CourseCard;
