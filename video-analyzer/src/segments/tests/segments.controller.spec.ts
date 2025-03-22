import { Test, TestingModule } from '@nestjs/testing';
import { SegmentsController } from '../segments.controller';
import { SegmentsService } from '../segments.service';

describe('SegmentsController', () => {
  let segmentsController: SegmentsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SegmentsController],
      providers: [SegmentsService],
    }).compile();

    segmentsController = app.get<SegmentsController>(SegmentsController);
  });

  describe('root', () => {
    it('should return "ok"', async () => {
      const actual = JSON.stringify(await segmentsController.getSRT());
      const expected = JSON.stringify({
        message: './src/The Geometry of Linear Equations (1).srt',
      });

      expect(actual).toBe(expected);
    });
  });
});
