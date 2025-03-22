export const segmentsSchema = {
  name: 'segments',
  strict: true,
  schema: {
    type: 'object',
    required: ['segments'],
    properties: {
      segments: {
        type: 'array',
        items: {
          type: 'object',
          required: ['title', 'summary', 'start', 'end'],
          properties: {
            start: {
              type: 'string',
              description: 'The start timestamp of the segment.',
            },
            end: {
              type: 'string',
              description: 'The end timestamp of the segment.',
            },
            title: {
              type: 'string',
              description:
                'The title of the segment, limited to under 7 words.',
            },
            summary: {
              type: 'string',
              description:
                'A brief description of the segment, limited to under 50 words.',
            },
          },
          additionalProperties: false,
        },
        description: 'An array of segments.',
      },
    },
    additionalProperties: false,
  },
};
