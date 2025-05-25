import { Segment } from '@/types/Segment';
import { ChangeEvent } from 'react';
import useMeasure from 'react-use-measure';

interface SegmentsTimelineProps {
  segments: Segment[];
  duration: number;
  currentTime: number;
  handleSeek: (event: ChangeEvent<HTMLInputElement>) => void;
  timelineRef?: React.RefObject<HTMLInputElement>;
}

const SegmentsTimeline = ({
  segments,
  duration,
  currentTime,
  handleSeek,
  timelineRef,
}: SegmentsTimelineProps) => {
  return (
    <div
      className="absolute bottom-7 left-0 w-full flex flex-col gap-1 pointer-events-auto"
      style={{ direction: 'ltr' }}
    >
      <div className="relative w-full">
        {/* Segments Layer */}
        <div className="absolute top-3 left-0 w-full h-1">
          {segments.map((segment, index) => (
            <SegmentItem key={index} segment={segment} duration={duration} />
          ))}
        </div>

        {/* Timeline Input */}
        <input
          type="range"
          min="0"
          ref={timelineRef}
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="relative w-full h-3 bg-transparent appearance-none cursor-pointer transition-all z-10
            focus:outline-none focus:ring-0
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
            [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20 [&::-webkit-slider-thumb]:translate-y-[1.5px]"
          style={{ direction: 'ltr' }}
        />
      </div>
    </div>
  );
};

const SegmentItem = ({
  segment,
  duration,
}: {
  segment: Segment;
  duration: number;
}) => {
  const [segmentRef, segmentBounds] = useMeasure();
  const [titleRef, titleBounds] = useMeasure();

  const processTitle = (): string | null => {
    if (!segment.title) return null;

    const segmentWidth = segmentBounds.width;
    const titleWidth = titleBounds.width;

    // If title fits completely
    if (titleWidth <= segmentWidth) {
      return segment.title;
    }

    // Check if even "..." fits
    const tempSpan = document.createElement('span');
    tempSpan.textContent = '...';
    document.body.appendChild(tempSpan);
    const dotsWidth = tempSpan.offsetWidth;

    // If even "..." doesn't fit, don't show anything
    if (dotsWidth > segmentWidth) {
      document.body.removeChild(tempSpan);
      return null;
    }

    // Check if first word + "..." fits
    const firstWord = segment.title.split(' ')[0];
    tempSpan.textContent = firstWord + '...';
    const firstWordWithDotsWidth = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);

    // If first word + "..." doesn't fit, just show "..."
    if (firstWordWithDotsWidth > segmentWidth) {
      return '...';
    }

    // Try to fit as much of the title as possible with "..."
    let text = segment.title;
    while (text.length > 0) {
      tempSpan.textContent = text + '...';
      document.body.appendChild(tempSpan);
      const width = tempSpan.offsetWidth;
      document.body.removeChild(tempSpan);

      if (width <= segmentWidth) {
        return text + '...';
      }
      text = text.slice(0, -1);
    }

    return '...';
  };

  const displayTitle = processTitle();
  const leftPosition = (segment.start / duration) * 100;
  const width = ((segment.end - segment.start) / duration) * 100;

  return (
    <div
      ref={segmentRef}
      className="absolute flex flex-col items-center group"
      style={{
        left: `${leftPosition}%`,
        width: `${width}%`,
      }}
    >
      <div className="absolute -top-6 w-full flex items-center justify-center">
        {segment.title && (
          <>
            <div
              ref={titleRef}
              className="absolute opacity-0 pointer-events-none"
              style={{ whiteSpace: 'nowrap' }}
            >
              {segment.title}
            </div>
            {displayTitle && (
              <div className="text-white text-xs pointer-events-none">
                {displayTitle}
              </div>
            )}
          </>
        )}
      </div>

      <div
        style={{ backgroundColor: segment.color }}
        className="h-1 w-full rounded-full cursor-pointer"
      />

      {/* Tooltip - Now shows for all segments */}
      <div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 
        bg-white/90 backdrop-blur-sm text-black text-xs rounded-lg px-3 py-2 
        opacity-0 group-hover:opacity-100 transition-opacity duration-200 
        shadow-lg min-w-[200px] z-50 pointer-events-none"
      >
        {segment.title ? (
          <>
            <div className="font-semibold mb-1 border-b border-gray-200 pb-1">
              {segment.title}
            </div>
            <div className="text-gray-600 text-[11px]">
              {segment.description}
            </div>
          </>
        ) : (
          <div className="text-gray-600 text-[11px]">{segment.description}</div>
        )}
        <div
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
          w-2 h-2 bg-white/90 rotate-45 shadow-lg"
        />
      </div>
    </div>
  );
};

export default SegmentsTimeline;
