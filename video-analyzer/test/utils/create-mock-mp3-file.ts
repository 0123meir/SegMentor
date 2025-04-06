import { BYTES_PER_MEGABYTE } from '../../src/modules/transcriptions/constants/bytes_per_megabyte';

export const createMockMp3File = (
  sizeMB: number,
  filename = 'VALID_AUDIO_FILE.mp3',
): { filename: string; buffer: Buffer } => {
  const sizeBytes = sizeMB * BYTES_PER_MEGABYTE;
  const mp3Header = Buffer.from([0xff, 0xfb, 0x50, 0x40]);
  const buffer = Buffer.concat([
    mp3Header,
    Buffer.alloc(sizeBytes - mp3Header.length, 0),
  ]);

  return {
    filename,
    buffer,
  };
};
