import { Test, TestingModule } from '@nestjs/testing';
import { VideoInitializerService } from '../video-initializer.service';

describe('VideoInitializerService', () => {
  let service: VideoInitializerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoInitializerService],
    }).compile();

    service = module.get<VideoInitializerService>(VideoInitializerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
