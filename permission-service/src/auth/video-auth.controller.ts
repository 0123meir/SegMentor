import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { S3 } from 'aws-sdk';

const VIDEO_S3_BUCKET = 'segmentor-raw-video';

@Controller('video')
export class VideoController {
  private s3 = new S3({
    region: process.env.AWS_REGION ?? 'eu-north-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    signatureVersion: 'v4',
  });

  @Post('token')
  async getVideoUrl(
    @Body('token') token: string,
    @Body('videoKey') videoKey: string,
  ) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'development_secret',
      ) as { role: string; sub: string };

      if (!videoKey) {
        throw new UnauthorizedException('Video key is required');
      }

      const s3Params = {
        Bucket: VIDEO_S3_BUCKET,
        Key: `${videoKey}`,
        Expires: 60 * 60 * 3,
      };

      const videoUrl = await this.s3.getSignedUrlPromise('getObject', s3Params);

      return { videoUrl };
    } catch (error) {
      throw new UnauthorizedException('Invalid token or video request', error);
    }
  }
}
