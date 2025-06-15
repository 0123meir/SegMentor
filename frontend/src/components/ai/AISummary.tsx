import { useTranscriptStore } from '@/state/TranscriptStore';
import { renderTextWithMath } from '@/utils/renderTextWithMath';
import { useEffect, useMemo, useState } from 'react';
import { detectTextDirection } from '../../utils/detectTextDirection';

export const AISummary = () => {
  const { expandedSummary, summaryTitle, isLoading } = useTranscriptStore();
  const [dots, setDots] = useState('');

  const textDir = useMemo<'ltr' | 'rtl'>(() => {
    return expandedSummary && detectTextDirection(expandedSummary) ? 'rtl' : 'ltr';
  }, [expandedSummary]);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (isLoading || !expandedSummary) {
    return (
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 flex-col">
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
        {isLoading ? (
          <p dir="ltr" className="text-gray-500 font-medium text-center">
            Loading{dots}
          </p>
        ) : (
          <p className="text-gray-500 text-center">No summary available.</p>
        )}
      </div>
    );
  }

  return (
    <div
      dir={textDir}
      className="bg-gray-100 p-4 rounded shadow w-full"
    >
      {summaryTitle && (
        <h3 className="text-md font-semibold mb-2">{summaryTitle}</h3>
      )}
      <p className="whitespace-pre-line">
        {renderTextWithMath(expandedSummary)}
      </p>
    </div>
  );
};
