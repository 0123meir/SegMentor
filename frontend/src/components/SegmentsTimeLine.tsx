import React, { useEffect, useState } from "react";

interface Segment {
  start: number;
  end: number;
  color: string;
  title?: string;
  description?: string;
}

interface SegmentsTimelineProps {
  duration: number;
  currentTime: number;
  handleSeek: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SegmentsTimeline: React.FC<SegmentsTimelineProps> = ({
  duration,
  currentTime,
  handleSeek,
}) => {
  const segmentsColors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A8",
    "#FFD700",
  ];
  const [segments, setSegments] = useState<Segment[]>([]);
  const placeholderSegment: Segment = {
    start: 0,
    end: duration,
    color: "#2563EB",
  };

  useEffect(() => {
    if (duration > 0) {
      setSegments(generateSegments(duration));
    }
  }, [duration]);

  //   dummy function to generate segements, need to receive from the server
  const generateSegments = (duration: number, segmentCount = 5): Segment[] => {
    if (duration === 0) return [];

    const titles = [
      "Intro",
      "Main Part",
      "Action Scene",
      "Twist",
      "Conclusion",
    ];
    const descriptions = [
      "This is the introduction.",
      "This part covers the main topic.",
      "Exciting action scene!",
      "A major twist happens here.",
      "Wrapping up the video.",
    ];

    let lastTime = 0;
    const segmentLengths = Array.from({ length: segmentCount }, () =>
      Math.random()
    );
    const total = segmentLengths.reduce((acc, val) => acc + val, 0);
    const normalizedLengths = segmentLengths.map(
      (val) => (val / total) * duration
    );

    const newSegments = normalizedLengths.map((length, i) => {
      const start = lastTime;
      const end = start + length;
      lastTime = end;

      return {
        start,
        end,
        color: segmentsColors[i % segmentsColors.length],
        title: titles[i] || `Segment ${i + 1}`,
        description: descriptions[i] || "No description available.",
      };
    });

    newSegments[newSegments.length - 1].end = duration;
    return newSegments;
  };

  return (
    <div
      className="absolute bottom-9 left-0 w-full flex flex-col"
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
        max={duration}
        value={currentTime}
        onChange={handleSeek}
        className="absolute left-0 mt-3 w-full h-5 bg-transparent appearance-none cursor-pointer transition-all
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
          [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
        style={{ direction: "ltr" }}
      />
    </div>
  );
};

export default SegmentsTimeline;
