import { useTranscriptStore } from '@/state/TranscriptStore';
import { renderTextWithMath } from '@/utils/renderTextWithMath';
import { useEffect, useMemo, useState } from 'react';

const isRTL = (text: string) => {
  const rtlPattern = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlPattern.test(text);
};

export const AIAssistant = () => {
  const { expandedSummary, summaryTitle, isLoading, error } =
    useTranscriptStore();

  const [dots, setDots] = useState('');

  const textDir = useMemo<'ltr' | 'rtl'>(() => {
    return expandedSummary && isRTL(expandedSummary) ? 'rtl' : 'ltr';
  }, [expandedSummary]);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (error) {
    return (
      <div
        dir="ltr"
        className="bg-white rounded-lg shadow-sm border border-gray-200 my-4 p-4 h-[calc(50vh-2rem)]"
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
    );
  }

  return (
    <div
      dir={textDir}
      className="bg-white rounded-lg shadow-sm border border-gray-200 my-4 p-4 h-[calc(50vh-2rem)]"
    >
      {expandedSummary && !isLoading ? (
        <div className="bg-gray-100 p-4 overflow-auto rounded shadow w-full max-h-[200px] overflow-y-auto">
          {summaryTitle && (
            <h3 className="text-md font-semibold mb-2">{summaryTitle}</h3>
          )}
          <p className="whitespace-pre-line">
            {renderTextWithMath(expandedSummary)}
          </p>
        </div>
      ) : (
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
          {isLoading && (
            <p dir="ltr" className="text-gray-500 font-medium">
              Loading{dots}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
