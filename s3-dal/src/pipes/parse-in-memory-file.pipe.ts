import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { extname } from 'path';
import { FileType } from 'src/types/file.type';
import { isFileSupported } from 'src/utils/is-file-supported';

@Injectable()
export class ParseInMemoryFilePipe implements PipeTransform {
  constructor(private readonly supportedFileTypes: FileType[]) {}

  transform(file: Express.Multer.File) {
    if (!isFileSupported(file, this.supportedFileTypes)) {
      throw new BadRequestException({
        message: 'File type not supported',
        fileMimeType: file.mimetype,
        fileExtension: extname(file.originalname),
      });
    }

    return file;
  }
}
