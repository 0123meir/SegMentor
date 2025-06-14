import { useTranscriptStore } from '@/state/TranscriptStore';
import { useEffect, useState } from 'react';
import { BsStars } from 'react-icons/bs';
import { FaCommentDots } from 'react-icons/fa';

import { AIChat } from './ai/AIChat';
import { AISummary } from './ai/AISummary';

export const AIAssistant = () => {
  const { isLoading, error } = useTranscriptStore();
  const [mode, setMode] = useState<'summary' | 'chat'>('chat');

  useEffect(() => {
    if (isLoading) {
      setMode('summary');
    }
  }, [isLoading]);

  return (
    <div
      dir="ltr"
      className="relative bg-white rounded-lg shadow-sm border border-gray-200 my-4 h-[calc(50vh-5rem)] flex flex-col"
    >
      <div className="absolute top-2 left-2 flex gap-2 z-10">
        <button
          onClick={() => setMode('chat')}
          className={`p-2 rounded-full text-white shadow transition ${
            mode === 'chat' ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
          }`}
          title="Chat"
        >
          <FaCommentDots size={16} />
        </button>
        <button
          onClick={() => setMode('summary')}
          className={`p-2 rounded-full text-white shadow transition ${
            mode === 'summary' ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
          }`}
          title="Summary"
        >
          <BsStars size={16} />
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
