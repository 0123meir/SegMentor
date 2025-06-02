import { useTranscriptStore } from '@/state/TranscriptStore';
import React from 'react';

const AIAssistant: React.FC = () => {
  const { expandedSummary, summaryTitle, isLoading, error } =
    useTranscriptStore();

  return (
    <div className="h-full w-full bg-gray-100 rounded-lg m-2 flex flex-col items-center justify-center">
      {error && <p className="text-red-500">{error}</p>}
      {expandedSummary && !isLoading ? (
        <div className="bg-gray-100 p-4 overflow-auto rounded shadow w-full max-h-[200px] overflow-y-auto">
          {summaryTitle && (
            <h3 className="text-md font-semibold mb-2">{summaryTitle}</h3>
          )}
          <p className="whitespace-pre-line">{expandedSummary}</p>
        </div>
      ) : (
        <p className="text-xl">AI Assistant</p>
      )}
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default AIAssistant;
