import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

export const MemoryStorageFileInterceptor = () => {
  return FileInterceptor('file', {
    storage: memoryStorage(),
  });
};
