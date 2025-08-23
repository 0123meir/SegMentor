import React from 'react';

interface SegmentTitleProps {
  title?: string;
  displayTitle: string | null;
  titleRef: (node: HTMLElement | null) => void;
  onClick?: () => void;
}

const SegmentTitle: React.FC<SegmentTitleProps> = ({
  title,
  displayTitle,
  titleRef,
  onClick,
}) => {
  if (!title) return null;
  return (
    <div className="absolute -top-6 w-full pl-1">
      <div
        ref={titleRef}
        className="absolute opacity-0 pointer-events-none"
        style={{ whiteSpace: 'nowrap' }}
      >
        {title}
      </div>
      {displayTitle && (
        <div
          className="text-white text-xs cursor-pointer hover:font-bold transition-all duration-150
          overflow-hidden whitespace-nowrap text-ellipsis"
          onClick={onClick}
        >
          {displayTitle}
        </div>
      )}
    </div>
  );
};

export default SegmentTitle;
