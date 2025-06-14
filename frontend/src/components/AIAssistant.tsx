import { useTranscriptStore } from '@/state/TranscriptStore';
import { useState } from 'react';

import { AIChat } from './ai/AIChat';
import { AISummary } from './ai/AISummary';

export const AIAssistant = () => {
  const { error } = useTranscriptStore();
  const [mode, setMode] = useState<'summary' | 'chat'>('chat');

  return (
    <div
      dir="ltr"
      className="bg-white rounded-lg shadow-sm border border-gray-200 my-4 h-[calc(50vh-5rem)] flex flex-col"
    >
      <div className="flex h-10 text-sm font-medium border-b border-gray-200">
        <button
          onClick={() => setMode('chat')}
          className={`w-1/2 px-4 py-2 transition ${
            mode === 'chat'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setMode('summary')}
          className={`w-1/2 px-4 py-2 transition ${
            mode === 'summary'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Summary
        </button>
      </div>
      {error ? (
        <div
          dir="ltr"
          className="bg-white rounded-lg shadow-sm border border-gray-200 my-4 p-4 h-[calc(50vh-5rem)]"
        >
          <div className="flex items-start gap-2 p-3 bg-red-50 text-red-800 border border-red-300 rounded-md shadow-sm">
            <div className="text-sm">
              <strong className="block font-semibold">
                Something went wrong
              </strong>
              <span>{error}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-4 overflow-y-auto">
          {mode === 'summary' ? <AISummary /> : <AIChat />}
        </div>
      )}
      ;
    </div>
  );
};
