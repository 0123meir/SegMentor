import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import OpenAI from 'openai';
import { config } from 'dotenv';
import { ChatCompletionMessageParam } from 'openai/resources';

config();

const AI_MODEL = 'gpt-4o-mini';
const max_completion_tokens = 8046;
const temperature = 0;
const top_p = 1;
const frequency_penalty = 0;
const presence_penalty = 0;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const promptText = `You are a tool that converts an SRT file of a lecture into distinct JSON segments.

Each segment must include:

title: The subject being discussed. Ensure that subjects are distinct and do not overlap. The tool must differentiate between segments that are teaching a subject (e.g., 'variables', 'classes', 'matrixes', 'summary') and those that are solving problems (e.g., 'question from test').
description: The description must be up to 50 words and provide a concise, direct explanation of the subject being discussed,
focusing solely on the content (e.g., details about 'variables', 'classes', etc.).
Do not include any meta commentary such as 'in this section...' or 'this segment introduces.'
The description should not refer to the structure of the output but only to the topic.
start_timestamp and end_timestamp: These must be copied exactly as they appear in the SRT file—from the first and last line of the segment.
Rules:

- Segments should only be formed when consecutive SRT lines discuss a similar topic and longer than 1 minute.
- Do not mention the lecturer or include phrases like 'in this segment.'
- If any section contains data that appears as gibberish or nonsensical, skip that section entirely.
- Break Detection:
    If the gap between the end timestamp of one SRT block and the start of the next is 30 seconds or more, skip that section (do not create a segment).
    Additionally, if the lecturer explicitly mentions a break (e.g., states "starting a break" or similar phrases) or if there is prolonged silence, skip that section.
- start and end timestamps must be the exact same as in the SRT file, do not create segmnets for times that don't exist in the SRT.
- Process the entire lecture
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

@Injectable()
export class SegmentsService {
  createSegmentsFromSRT = async (srtFilePath: string) => {
    const srt = fs.readFileSync(srtFilePath, 'utf8');

    try {
      const response = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: generateSegmentsPrompt(srt),
        response_format: {
          type: 'json_schema',
          json_schema: segmentsSchema,
        },
        temperature,
        max_completion_tokens,
        top_p,
        frequency_penalty,
        presence_penalty,
      });

      return JSON.parse(response.choices[0].message.content); //TODO: save to db when ready
    } catch (error) {
      console.error(error);
    }
  };
}
