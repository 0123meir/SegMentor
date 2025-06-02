import { useApi } from '@/hooks/useApi';
import { useTranscriptStore } from '@/state/TranscriptStore';
import React, { useEffect, useMemo } from 'react';

interface SegmentTooltipProps {
  title?: string;
  description?: string;
}

const SegmentTooltip: React.FC<SegmentTooltipProps> = ({
  title,
  description,
}) => {
  const rawApi = useApi();
  const api = useMemo(() => rawApi, []);

  const { initState, expandSummary, isLoading } = useTranscriptStore();

  useEffect(() => {
    initState(api);
  }, [api]);

  const handleExpand = async () => {
    if (description) await expandSummary(description, title);
  };

  return (
    <div
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 
      bg-white/90 backdrop-blur-sm text-black text-xs rounded-lg px-3 py-2 
      opacity-0 group-hover:opacity-100 transition-opacity duration-200 
      shadow-lg min-w-[200px] z-50 pointer-events-auto"
    >
      {title ? (
        <>
          <div className="font-semibold mb-1 border-b border-gray-200 pb-1">
            {title}
          </div>
          <div className="text-gray-600 text-[11px]">{description}</div>
        </>
      ) : (
        <div className="text-gray-600 text-[11px]">{description}</div>
      )}
      <button
        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-[10px] px-2 py-1 rounded"
        onClick={handleExpand}
        disabled={isLoading}
      >
        {isLoading ? 'Expanding...' : 'Expand Summary'}
      </button>
      <div
        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
        w-2 h-2 bg-white/90 rotate-45 shadow-lg"
      />
    </div>
  );
};

export default SegmentTooltip;
