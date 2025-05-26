import { Segment } from '@/types/Segment';
import { ChangeEvent } from 'react';

import SegmentItem from './SegmentItem';

interface SegmentsTimelineProps {
  segments: Segment[];
  duration: number;
  currentTime: number;
  handleSeek: (event: ChangeEvent<HTMLInputElement>) => void;
  timelineRef?: React.RefObject<HTMLInputElement>;
}

const SegmentsTimeline: React.FC<SegmentsTimelineProps> = ({
  segments,
  duration,
  currentTime,
  handleSeek,
  timelineRef,
}) => (
  <div
    className="absolute bottom-7 left-0 w-full flex flex-col gap-1 pointer-events-auto"
    style={{ direction: 'ltr' }}
  >
    <div className="relative w-full">
      <div className="absolute top-3 left-0 w-full h-1">
        {segments.map((segment, idx) => (
          <SegmentItem key={idx} segment={segment} duration={duration} />
        ))}
      </div>
      <input
        type="range"
        min={0}
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

export default SegmentsTimeline;
