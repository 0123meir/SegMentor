import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';

@Injectable()
export class AudioUploadRepository {
  async uploadFileToS3(mp3Output: string): Promise<void> {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(mp3Output));

    try {
      const response = await axios.post(
        `${process.env.UPLOAD_FILE_S3_URL}/audio`,
        formData,
        {
          headers: formData.getHeaders(),
        },
      );

      Logger.log('File uploaded to S3:', response.data);
    } catch (error) {
      Logger.error('Failed to upload file to S3:', error);
      throw error;
    }
  }
}
