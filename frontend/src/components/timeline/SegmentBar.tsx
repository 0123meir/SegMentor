import React from 'react';

interface SegmentBarProps {
  color: string;
}

const SegmentBar: React.FC<SegmentBarProps> = ({ color }) => (
  <div
    style={{
      backgroundColor: color,
      width: `calc(100% - 2px)`,
      marginLeft: '1px',
      marginRight: '1px',
    }}
    className="h-1 cursor-pointer"
  />
);

export default SegmentBar;
