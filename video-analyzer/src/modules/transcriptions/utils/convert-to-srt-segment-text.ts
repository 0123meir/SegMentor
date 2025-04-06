import { JsonTranscriptionSegment } from '../types/json-transcription-segment.type';
import { convertSecondsToSrtTimestamp } from './convert-seconds-to-srt-timestamp';

export const convertToSrtSegmentText = (
  segment: JsonTranscriptionSegment,
  segmentIndex: number,
): string => {
  return `${segmentIndex + 1}\n${convertSecondsToSrtTimestamp(segment.start)} --> ${convertSecondsToSrtTimestamp(segment.end)}\n${segment.text}\n\n`;
};
