import { FileType } from 'src/types/file.type';

export const getSwaggerSupportedFileTypes = (
  supportedFileTypes: FileType[],
) => {
  return supportedFileTypes
    .map(({ extension, mimeTypes }) => `${extension} - ${mimeTypes}`)
    .join(', ');
};
