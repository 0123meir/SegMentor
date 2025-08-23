import { useTranscriptStore } from '@/state/TranscriptStore';
import { Segment } from '@/types/Segment';
import { useMemo } from 'react';
import useMeasure from 'react-use-measure';

import SegmentBar from './SegmentBar';
import SegmentTitle from './SegmentTitle';

interface SegmentItemProps {
  segment: Segment;
  duration: number;
}

const SegmentItem: React.FC<SegmentItemProps> = ({ segment, duration }) => {
  const [segmentRef, segmentBounds] = useMeasure();
  const [titleRef, titleBounds] = useMeasure();
  const { setSummary, setMode } = useTranscriptStore();

  const handleTitleClick = () => {
    if (segment.description) {
      setSummary(segment.description, segment.title);
      setMode('summary');
    }
  };

  const getDisplayTitle = (
    title?: string,
    segmentWidth = 0,
    titleWidth = 0
  ): string | null => {
    if (!title) return null;
    if (titleWidth <= segmentWidth * 1.25) return title;

    const tempSpan = document.createElement('span');
    tempSpan.textContent = '...';
    document.body.appendChild(tempSpan);
    const dotsWidth = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);

    if (dotsWidth > segmentWidth) return null;

    let text = title;
    while (text.length > 0) {
      tempSpan.textContent = text + '...';
      document.body.appendChild(tempSpan);
      const width = tempSpan.offsetWidth;
      document.body.removeChild(tempSpan);

      if (width <= segmentWidth * 1.25) {
        return text + '...';
      }
      text = text.slice(0, -1);
    }
    return '...';
  };

  const displayTitle = useMemo(
    () =>
      getDisplayTitle(segment.title, segmentBounds.width, titleBounds.width),
    [segment.title, segmentBounds.width, titleBounds.width]
  );

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
      <SegmentTitle
        title={segment.title}
        displayTitle={displayTitle}
        titleRef={titleRef}
        onClick={handleTitleClick}
      />
      <SegmentBar color={segment.color} />
    </div>
  );
};

export default SegmentItem;
