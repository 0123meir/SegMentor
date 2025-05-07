import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { CourseList } from './courses/CourseList';

export const LeftSideMenu = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div
      className={`relative transition-all duration-300 ${
        isOpen ? 'w-1/4' : 'w-0'
      }`}
    >
      <div
        className={`absolute top-0 h-full bg-gray-200 transition-all duration-300 ${
          isOpen ? 'w-full' : 'w-0'
        } overflow-y-auto overflow-x-hidden`}
      >
        <CourseList />
      </div>

      <div
        onClick={toggle}
        className="absolute top-1/2 -translate-y-1/2 -right-8 w-8 h-32 cursor-pointer flex items-center justify-center"
        style={{
          clipPath: 'polygon(0 0, 100% 15%, 100% 85%, 0 100%)',
          backgroundColor: '#E5E7EB',
        }}
      >
        <div className="flex items-center justify-center h-full text-gray-600">
          {isOpen ? <FiChevronLeft size={'2rem'} /> : <FiChevronRight size={'2rem'} />}
        </div>
      </div>
    </div>
  );
};
