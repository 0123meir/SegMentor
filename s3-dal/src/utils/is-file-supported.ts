import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { extname } from 'path';
import { FileType } from 'src/types/file.type';

type InterceptedFile = Parameters<MulterOptions['fileFilter']>[1];

export const isFileSupported = (
  file: Express.Multer.File | InterceptedFile,
  allowedFileTypes: FileType[],
): boolean => {
  const fileExtension = extname(file.originalname);

  return allowedFileTypes.some((allowedFileType) => {
    return (
      fileExtension === allowedFileType.extension &&
      (allowedFileType.mimeTypes as string[]).includes(file.mimetype)
    );
  });
};
