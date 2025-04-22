import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { FILE_UPLOAD_DIRECTORY } from '../constants/file-upload-directory';
import { ALLOWED_FILE_MIME_TYPES } from '../constants/allowed-file-mime-types';

export const VideoUploadInterceptor = FileInterceptor('file', {
    // also need to generate the id for the file
  storage: diskStorage({
    destination: FILE_UPLOAD_DIRECTORY,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_FILE_MIME_TYPES.includes(file.mimetype)) {
      return cb( 
        new HttpException(
          'Only MP4 files are allowed!',
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
    cb(null, true);
  },
});
