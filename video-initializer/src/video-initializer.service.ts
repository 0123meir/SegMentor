import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { noop } from 'rxjs';
import { AudioUploadRepository } from './repositories/audio-upload.repository';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import * as ffprobeInstaller from '@ffprobe-installer/ffprobe';

@Injectable()
export class VideoInitializerService implements OnModuleInit {
  constructor(private readonly audioUploadRepository: AudioUploadRepository) {}

  onModuleInit() {
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);
    ffmpeg.setFfprobePath(ffprobeInstaller.path);
  }

  async extractMp3(inputPath: string, fileId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      Logger.log('Starting MP3 extraction with file:', inputPath);
      const mp3Output = inputPath.replace(path.extname(inputPath), '.mp3');

      ffmpeg(inputPath)
        .noVideo()
        .audioCodec('libmp3lame')
        .on('end', async () => {
          Logger.log('MP3 extraction complete:', mp3Output);

          try {
            await this.audioUploadRepository.uploadFileToS3(mp3Output);
            // uplaod fileId to the kafka topic
            resolve();
          } catch (error) {
            reject(error);
          } finally {
            unlink(mp3Output).catch(noop);
            unlink(inputPath).catch(noop);
          }
        })
        .on('error', (err) => {
          Logger.error('Error during MP3 extraction:', err);
          unlink(mp3Output).catch(noop);
          unlink(inputPath).catch(noop);

          reject(err);
        })
        .save(mp3Output);
    });
  }
}
