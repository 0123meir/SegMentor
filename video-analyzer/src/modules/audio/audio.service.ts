import { Injectable, OnModuleInit } from '@nestjs/common';
import fs from 'fs';
import { CHUNK_DURATION_SECONDS, OUTPUT_CHUNKS_DIRECTORY } from './constants';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import { glob } from 'glob';
import { rm } from 'fs/promises';

@Injectable()
export class AudioService implements OnModuleInit {
  onModuleInit() {
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);
    ffmpeg.setFfprobePath(ffprobeInstaller.path);

    if (!fs.existsSync(OUTPUT_CHUNKS_DIRECTORY)) {
      fs.mkdirSync(OUTPUT_CHUNKS_DIRECTORY);
    }
  }

  splitAudio(fileId: string, filePath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (error, metadata) => {
        if (error) {
          return reject(error);
        }

        const totalDuration = metadata.format.duration;

        let startTime = 0;
        let chunkIndex = 0;

        const chunkFiles = [];
        const chunkTasks = [];

        while (startTime < totalDuration) {
          const outputFile = this.getChunkFileName(fileId, chunkIndex);
          chunkFiles.push(outputFile);

          chunkTasks.push(
            this.defineChunkTask(filePath, startTime, outputFile),
          );
          chunkIndex++;
          startTime += CHUNK_DURATION_SECONDS;
        }

        Promise.all(chunkTasks)
          .then(() => resolve(chunkFiles))
          .catch(reject);
      });
    });
  }

  async removeAudioChunks(fileId: string) {
    const chunkDirectory = `${OUTPUT_CHUNKS_DIRECTORY}/${fileId}_chunk_*`;
    const chunkFiles = await glob(chunkDirectory);

    await Promise.all(chunkFiles.map((file) => rm(file)));
  }

  private defineChunkTask(
    filePath: string,
    startTime: number,
    outputFile: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      ffmpeg(filePath)
        .setStartTime(startTime)
        .duration(CHUNK_DURATION_SECONDS)
        .output(outputFile)
        .on('end', () => resolve(outputFile))
        .on('error', reject)
        .run();
    });
  }

  private getChunkFileName(fileId: string, chunkIndex: number): string {
    return `${OUTPUT_CHUNKS_DIRECTORY}/${fileId}_chunk_${chunkIndex}.mp3`;
  }
}
