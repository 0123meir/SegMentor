import React from 'react';

interface AddCourseFormProps {
  onAdd: () => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddCourseForm: React.FC<AddCourseFormProps> = ({
  onAdd,
  value,
  onChange,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Enter course name"
      className="w-full p-3 border border-gray-300 rounded-md mb-4 text-base"
    />
    <button
      onClick={onAdd}
      className="bg-blue-500 text-white border-none py-3 px-6 rounded-md cursor-pointer text-base hover:bg-blue-600"
    >
      Add Course
    </button>
  </div>
);

export default AddCourseForm;
