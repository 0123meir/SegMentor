import React from 'react';

interface SegmentTooltipProps {
  title?: string;
  description?: string;
}
//TODO: change the tooltip, maybe a popup on the video, or make a tab for the description in the AI section
const SegmentTooltip: React.FC<SegmentTooltipProps> = ({
  title,
  description,
}) => (
  <div
    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 
      bg-white/90 backdrop-blur-sm text-black text-xs rounded-lg px-3 py-2 
      opacity-0 group-hover:opacity-100 transition-opacity duration-200 
      shadow-lg min-w-[200px] z-50 pointer-events-none"
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
    <div
      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
        w-2 h-2 bg-white/90 rotate-45 shadow-lg"
    />
  </div>
);

export default SegmentTooltip;
