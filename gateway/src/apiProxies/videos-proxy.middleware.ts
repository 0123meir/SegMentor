import { Request, Response, NextFunction } from 'express';

export const videosProxy = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const videoId = req.params.videoId as string;
  if (!videoId) {
    return res.status(400).json({ error: 'Missing videoId parameter' });
  }
  const videoUrl = `${process.env.VITE_CLOUDFRONT_DOMAIN_URL}/${videoId}.mp4`;
  res.json(videoUrl);
};
