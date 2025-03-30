import { Request } from 'express';

export type FileRequest = Request & { fileId: string };
