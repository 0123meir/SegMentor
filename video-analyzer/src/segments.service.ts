import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import OpenAI from 'openai';
import { config } from 'dotenv';
import { ChatCompletionMessageParam } from 'openai/resources';

config();

const AI_MODEL = 'gpt-4o-mini';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const promptText = `You are a tool that converts SRT files of a lecture into distinct segments,
Each segment should include:
- Title : the subject spoken about, inferred from the content the lecturer is talking about.
- Description: an explanation about the subject up to 50 words.
- timestamps: the start and end timestamp of each segment, copied from the first and last used SRT line.

# Notes
- Do not mention the lecturer.
- Do not write "in this segment"
- Do not include data that seems to be gibberish or not sensible 
- Make sure to segmentize the whole lecture.
- Include breaks as a segment if any exist.
- create the minimum amount of segments possible while keeping distinct subjects
`;
const segmentsSchema = {
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

const generateSegmentsPrompt = (srt: string) =>
  [
    {
      role: 'system',
      content: [
        {
          type: 'text',
          text: promptText,
        },
      ],
    },
    { role: 'user', content: [{ type: 'text', text: srt }] },
  ] as ChatCompletionMessageParam[];

export const createSegmentsFromSRT = async (srtFilePath: string) => {
  const srt = fs.readFileSync(srtFilePath, 'utf8');

  try {
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: generateSegmentsPrompt(srt),
      response_format: {
        type: 'json_schema',
        json_schema: segmentsSchema,
      },
      temperature: 0.5,
      max_completion_tokens: 8046,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
  
    return JSON.parse(response.choices[0].message.content); //TODO: save to db when ready
  } catch (error) {
    console.error(error);
  }
};
