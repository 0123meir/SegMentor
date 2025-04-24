import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { noop } from 'rxjs';
import axios from 'axios';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as fs from 'fs';
import * as FormData from 'form-data';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import * as ffprobeInstaller from '@ffprobe-installer/ffprobe';

@Injectable()
export class VideoInitializerService implements OnModuleInit {
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

          const formData = new FormData();
          formData.append('file', fs.createReadStream(mp3Output));

          const response = await axios.post(
            `${process.env.UPLOAD_FILE_S3_URL}`,
            formData,
            {
              headers: formData.getHeaders(),
            },
          );

          Logger.log('File uploaded to S3:', response.data);
          unlink(mp3Output).catch(noop);
          unlink(inputPath).catch(noop);

          // upload the file id to the kafka topic
          resolve();
        })
        .on('error', (err) => {
          Logger.error('Error during MP3 extraction:', err);
          reject(err);
        })
        .save(mp3Output);
    });
  }
}
