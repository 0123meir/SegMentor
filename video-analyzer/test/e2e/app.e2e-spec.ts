import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import OpenAI from 'openai';
import path from 'path';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { OPEN_AI_CLIENT } from '../../src/modules/open-ai/constants';
import { SegmentsService } from '../../src/modules/segments/segments.service';
import { TranscriptionsService } from '../../src/modules/transcriptions/transcriptions.service';
import { exampleSegments } from '../data/example-segments';
import { mockSegmentsService, mockTranscriptionsService } from '../mocks';
import { createMockMp3File } from '../utils/create-mock-mp3-file';

describe('App controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TranscriptionsService)
      .useValue(mockTranscriptionsService)
      .overrideProvider(SegmentsService)
      .useValue(mockSegmentsService)
      .overrideProvider(OPEN_AI_CLIENT)
      .useValue(new OpenAI({ apiKey: 'FAKE_API_KEY' }))
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/POST invalid file type', async () => {
    const response = await request(app.getHttpServer())
      .post('/segments')
      .attach(
        'file',
        path.resolve(__dirname, '../data/invalid-audio-file.txt'),
      );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('File type not supported');
  });

  it('/POST audio file under open ai limit 25MB', async () => {
    const fileSizeMB = 5;

    const { filename, buffer } = createMockMp3File(fileSizeMB);

    const response = await request(app.getHttpServer())
      .post('/segments')
      .attach('file', buffer, { filename, contentType: 'audio/mpeg' });

    expect(response.status).toBe(201);
    expect(JSON.stringify(response.body.segments)).toBe(
      JSON.stringify(exampleSegments),
    );
  });

  it('/POST audio file over open ai limit 25MB', async () => {
    const fileSizeMB = 30;

    const { filename, buffer } = createMockMp3File(fileSizeMB);

    const response = await request(app.getHttpServer())
      .post('/segments')
      .attach('file', buffer, { filename, contentType: 'audio/mpeg' });

    expect(response.status).toBe(201);
    expect(JSON.stringify(response.body.segments)).toBe(
      JSON.stringify(exampleSegments),
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
