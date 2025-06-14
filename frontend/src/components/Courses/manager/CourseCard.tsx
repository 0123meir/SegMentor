import UploadLectureModal from '@/components/UploadLectureModal.tsx';
import { Course, Lecture } from '@/types/Course';
import { useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';

import LectureList from './LectureList';

interface CourseCardProps {
  course: Course;
  courseIndex: number;
  onAddLecture: (courseIndex: string, lecture: Lecture) => void;
  onEditLecture: (courseIndex: number, lectureIndex: number) => void;
  onDeleteLecture: (courseIndex: number, lectureIndex: number) => void;
}

const CourseCard = ({
  course,
  courseIndex,
  onAddLecture,
  onEditLecture,
  onDeleteLecture,
}: CourseCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#2c3e50] text-xl font-semibold">{course.name}</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title="Add lecture"
        >
          <FiPlusCircle size={24} />
        </button>
      </div>

      <UploadLectureModal
        isOpen={isModalOpen}
        uploadLecture={onAddLecture}
        onClose={handleCloseModal}
        courseId={course._id}
      />

      <LectureList
        lectures={course.lectures}
        onEdit={onEditLecture}
        onDelete={onDeleteLecture}
        courseIndex={courseIndex}
      />
    </div>
  );
};

export default CourseCard;
