import { ValueOf } from './value-of.type';

export const FileType = {
  SRT: {
    extension: '.srt',
    mimeTypes: ['text/plain'],
  },
  MP3: {
    extension: '.mp3',
    mimeTypes: ['audio/mpeg'],
  },
  JSON: {
    extension: '.json',
    mimeTypes: ['application/json'],
  },
  MP4: {
    extension: '.mp4',
    mimeTypes: ['video/mp4'],
  },
} as const satisfies Record<
  string,
  {
    extension: `.${string}`;
    mimeTypes: `${string}/${string}`[];
  }
>;

export type FileType = ValueOf<typeof FileType>;
