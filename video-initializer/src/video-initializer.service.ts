import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import * as ffprobeInstaller from '@ffprobe-installer/ffprobe';

@Injectable()
export class VideoInitializerService implements OnModuleInit {
  onModuleInit() {
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);
    ffmpeg.setFfprobePath(ffprobeInstaller.path);
  }

  async extractMp3(inputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      Logger.log('Starting MP3 extraction with file:', inputPath);
      const mp3Output = inputPath.replace(path.extname(inputPath), '.mp3');

      ffmpeg(inputPath)
        .noVideo()
        .audioCodec('libmp3lame')
        .on('end', () => {
          Logger.log('MP3 extraction complete:', mp3Output);
          resolve(mp3Output);
        })
        .on('error', (err) => {
          Logger.error('Error during MP3 extraction:', err);
          reject(err);
        })
        .save(mp3Output);

        // here need to return the mp3 to the s3 and use kafka with the video id
        // and after that remove the mp3 and mp4 files 
    });
  }
}
