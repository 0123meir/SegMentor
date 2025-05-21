import { useSegmentsStore } from "@/state/SegmentsStore";
import { Segment } from "@/types/Segment";
import React from "react";
interface SegmentsTimelineProps {
  duration: number;
  currentTime: number;
  handleSeek: (event: React.ChangeEvent<HTMLInputElement>) => void;
  timelineRef?: React.RefObject<HTMLInputElement>;
}

const SegmentsTimeline: React.FC<SegmentsTimelineProps> = ({
  duration,
  currentTime,
  handleSeek,
  timelineRef,
}) => {
  const placeholderSegment: Segment = {
    start: 0,
    end: duration,
    color: "#2563EB",
    title: "",
    description: ""
  };


  const {segments} = useSegmentsStore();

  return (
    <div
      className="absolute bottom-9 left-0 w-full flex flex-col pointer-events-auto"
      style={{ direction: "ltr" }}
    >
      <div className="flex flex-row gap-1 w-full">
        {(segments.length === 0 ? [placeholderSegment] : segments).map(
          (segment, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center"
              style={{ flex: `${segment.end - segment.start} 0 auto` }}
            >
              <div className="h-4 mb-1 flex items-center justify-center">
                {segment.title && (
                  <div className="text-white text-xs relative group cursor-pointer">
                    {segment.title}
                    <div
                      className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white text-black text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        minWidth: "150px",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        textAlign: "center",
                      }}
                    >
                      {segment.description}
                    </div>
                  </div>
                )}
              </div>

              <div
                style={{ backgroundColor: segment.color }}
                className="h-1 w-full rounded-full cursor-pointer"
              />
            </div>
          )
        )}
      </div>

      <input
        type="range"
        min="0"
        ref={timelineRef}
        max={duration}
        value={currentTime}
        onChange={handleSeek}
        className="absolute left-0 mt-3 w-full h-5 bg-transparent appearance-none cursor-pointer transition-all
          focus:outline-none focus:ring-0
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
          [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
        style={{ direction: "ltr" }}
      />
    </div>
  );
};

export default SegmentsTimeline;
