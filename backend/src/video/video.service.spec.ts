import { Test, TestingModule } from '@nestjs/testing';
import { VideoService } from './video.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Video } from '../database/entity/video.entity';
import { Repository } from 'typeorm';

describe('VideoService', () => {
  let service: VideoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoService,
        {
          provide: getRepositoryToken(Video),
          useClass: Repository, 
        },
      ],
    }).compile();

    service = module.get<VideoService>(VideoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
