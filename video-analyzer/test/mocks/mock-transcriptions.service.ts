import { TranscriptionData } from 'src/modules/transcriptions/types/transcription-data.type';
import { exampleTranscription } from '../data/example-transcription';

export const mockTranscriptionsService = {
  transcribe: async (
    _fileId: string,
    _file: Express.Multer.File,
  ): Promise<TranscriptionData> => {
    return {
      transcription: exampleTranscription,
      language: 'English',
    };
  },
};
