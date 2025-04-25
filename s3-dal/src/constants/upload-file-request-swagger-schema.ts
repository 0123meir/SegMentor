export const uploadFileRequestSwaggerSchema = {
  type: 'object',
  properties: {
    file: {
      type: 'string',
      format: 'binary',
    },
    fileId: {
      type: 'string',
    },
  },
};
