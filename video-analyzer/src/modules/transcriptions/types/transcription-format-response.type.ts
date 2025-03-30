import { TranscriptionVerbose } from 'openai/resources/audio/transcriptions';
import { TranscriptionFormat } from './transcription-format.enum';

export type TranscriptionFormatResponse = {
  [TranscriptionFormat.JSON]: TranscriptionVerbose;
  [TranscriptionFormat.SRT]: string;
};
