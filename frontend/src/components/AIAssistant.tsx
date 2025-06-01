export const AIAssistant = () => {
  return (
    <div
      dir="ltr"
      className="bg-white rounded-lg shadow-sm border border-gray-200 my-4 p-4 h-[calc(50vh-2rem)]"
    >
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
        <svg
          className="w-5 h-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <h2 className="text-lg font-medium text-gray-700">AI Assistant</h2>
      </div>
      <div className="h-[calc(100%-3rem)] overflow-y-auto">
        <p className="text-gray-500 text-sm">
         To be added soon!
        </p>
      </div>
    </div>
  );
};
