import { ChangeEvent } from 'react';

interface AddCourseFormProps {
  onAdd: () => void;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const AddCourseForm = ({ onAdd, value, onChange }: AddCourseFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center gap-2 max-w-md">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Enter course name"
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Add Course
        </button>
      </div>
    </form>
  );
};

export default AddCourseForm;
