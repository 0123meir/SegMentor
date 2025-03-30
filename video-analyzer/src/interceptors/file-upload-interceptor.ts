import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ALLOWED_FILE_MIME_TYPES } from 'src/constants/allowed-file-mime-types';
import { FILE_UPLOAD_DIRECTORY } from 'src/constants/file-upload-directory';
import { FileRequest } from 'src/types/file-request.type';

export const FileUploadInterceptor = FileInterceptor('file', {
  storage: diskStorage({
    destination: FILE_UPLOAD_DIRECTORY,
    filename: (req: FileRequest, file, cb) => {
      const fileName = `${req.fileId}${extname(file.originalname)}`;

      cb(null, fileName);
    },
  }),
  fileFilter: (req: FileRequest, file, cb) => {
    if (!ALLOWED_FILE_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new BadRequestException({
          message: 'File type not supported',
          fileType: file.mimetype,
          fileId: req.fileId,
        }),
        false,
      );
    }

    cb(null, true);
  },
});
