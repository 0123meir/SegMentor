import { Test, TestingModule } from '@nestjs/testing';
import { VideoInitializerController } from '../src/video-initializer.controller';

describe('VideoInitializerController', () => {
  let controller: VideoInitializerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoInitializerController],
    }).compile();

    controller = module.get<VideoInitializerController>(VideoInitializerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
