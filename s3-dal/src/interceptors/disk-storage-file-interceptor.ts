import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FILE_UPLOAD_DIRECTORY } from 'src/constants/file-upload-directory';
import { FileType } from 'src/types/file.type';
import { isFileSupported } from 'src/utils/is-file-supported';

export const DiskStorageFileInterceptor = (allowedFileTypes?: FileType[]) => {
  return FileInterceptor('file', {
    storage: diskStorage({
      destination: FILE_UPLOAD_DIRECTORY,
      filename: (_req, file, cb) => {
        cb(null, file.originalname);
      },
    }),
    fileFilter: (req, file, cb) => {
      const fileId = req.body.fileId;

      if (!allowedFileTypes?.length) {
        return cb(null, true);
      }

      if (!isFileSupported(file, allowedFileTypes)) {
        return cb(
          new BadRequestException({
            message: 'File type not supported',
            fileMimeType: file.mimetype,
            fileExtension: extname(file.originalname),
            fileId,
          }),
          false,
        );
      }

      cb(null, true);
    },
  });
};
