import { Segment } from '../../src/modules/segments/types/segment';
import { TranscriptionData } from '../../src/modules/transcriptions/types/transcription-data.type';
import { exampleSegments } from '..//data/example-segments';

export const mockSegmentsService = {
  createSegmentsFromTranscription: async (
    _fileId: string,
    _transcriptionData: TranscriptionData,
  ): Promise<Segment[]> => {
    return exampleSegments;
  },
};
