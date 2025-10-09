import { Test, TestingModule } from '@nestjs/testing';
import { VideoService } from './video.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Video } from '../database/entity/video.entity';
import { User } from '../database/entity/user.entity';
import { Repository } from 'typeorm';

describe('VideoService', () => {
  let service: VideoService;
  let repository: Repository<Video>;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoService,
        {
          provide: getRepositoryToken(Video),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<VideoService>(VideoService);
    repository = module.get<Repository<Video>>(getRepositoryToken(Video));

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of videos', async () => {
      const mockVideos: Video[] = [
        { id: '1', title: 'Video 1' } as Video,
        { id: '2', title: 'Video 2' } as Video,
      ];
      mockRepository.find.mockResolvedValue(mockVideos);

      const result = await service.findAll();

      expect(result).toEqual(mockVideos);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no videos exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a video by id', async () => {
      const mockVideo: Video = { id: '1', title: 'Video 1' } as Video;
      mockRepository.findOneBy.mockResolvedValue(mockVideo);

      const result = await service.findOne('1');

      expect(result).toEqual(mockVideo);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('should return null when video is not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne('999');

      expect(result).toBeNull();
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: '999' });
    });
  });

  describe('create', () => {
    it('should create and return a new video', async () => {
      const videoData = { title: 'New Video', format: 'video' } as Video;
      const savedVideo = { id: '1', ...videoData } as Video;
      mockRepository.save.mockResolvedValue(savedVideo);

      const result = await service.create(videoData);

      expect(result).toEqual(savedVideo);
      expect(mockRepository.save).toHaveBeenCalledWith(videoData);
    });
  });

  describe('update', () => {
    it('should update and return the updated video', async () => {
      const videoData = { title: 'Updated Video' } as Video;
      const updatedVideo = { id: '1', ...videoData } as Video;
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOneBy.mockResolvedValue(updatedVideo);

      const result = await service.update('1', videoData);

      expect(result).toEqual(updatedVideo);
      expect(mockRepository.update).toHaveBeenCalledWith('1', videoData);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });
  });

  describe('remove', () => {
    it('should delete a video', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('findPaginated', () => {
    it('should return paginated videos with total count', async () => {
      const mockVideos: Video[] = [
        { id: '1', title: 'Video 1', score: 100 } as Video,
        { id: '2', title: 'Video 2', score: 90 } as Video,
      ];
      const mockTotal = 10;
      mockRepository.findAndCount.mockResolvedValue([mockVideos, mockTotal]);

      const result = await service.findPaginated(1, 2);

      expect(result).toEqual({ data: mockVideos, total: mockTotal });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 2,
        order: {
          score: 'DESC',
        },
      });
    });

    it('should calculate correct skip for page 2', async () => {
      const mockVideos: Video[] = [
        { id: '3', title: 'Video 3', score: 80 } as Video,
      ];
      mockRepository.findAndCount.mockResolvedValue([mockVideos, 10]);

      await service.findPaginated(2, 5);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        order: {
          score: 'DESC',
        },
      });
    });

    it('should handle page 3 with limit 15', async () => {
      const mockVideos: Video[] = [];
      mockRepository.findAndCount.mockResolvedValue([mockVideos, 0]);

      await service.findPaginated(3, 15);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        skip: 30,
        take: 15,
        order: {
          score: 'DESC',
        },
      });
    });
  });

  describe('prepareUploadData', () => {
    it('should prepare upload data from file and metadata', () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.mp4',
        mimetype: 'video/mp4',
        size: 1024,
      } as Express.Multer.File;

      const result = service.prepareUploadData(
        mockFile,
        'Test description',
        'Test transcription',
      );

      expect(result).toEqual({
        buffer: mockFile.buffer,
        originalname: 'test.mp4',
        mimetype: 'video/mp4',
        size: 1024,
        description: 'Test description',
        transcription: 'Test transcription',
      });
    });

    it('should handle empty description and transcription', () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 512,
      } as Express.Multer.File;

      const result = service.prepareUploadData(mockFile, '', '');

      expect(result.description).toBe('');
      expect(result.transcription).toBe('');
    });
  });

  describe('saveUploadedVideo', () => {
    it('should save video from cloudinary data', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' } as User;

      const cloudinaryData = {
        original_filename: 'my-video',
        resource_type: 'video',
        secure_url: 'https://cloudinary.com/video.mp4',
        duration: 120,
        public_id: 'cloudinary-id-123',
      };

      const expectedVideo = {
        title: 'my-video',
        format: 'video',
        link: 'https://cloudinary.com/video.mp4',
        duration: 120,
        publicId: 'cloudinary-id-123',
        score: 0,
        description: 'Test description',
        transcription: 'Test transcription',
        user: mockUser,
      };

      mockRepository.save.mockResolvedValue({
        id: '1',
        ...expectedVideo,
      } as Video);

      const result = await service.saveUploadedVideo(
        cloudinaryData,
        'Test description',
        'Test transcription',
        mockUser,
      );

      expect(result.title).toBe('my-video');
      expect(result.format).toBe('video');
      expect(result.link).toBe('https://cloudinary.com/video.mp4');
      expect(result.duration).toBe(120);
      expect(result.publicId).toBe('cloudinary-id-123');
      expect(result.score).toBe(0);
      expect(result.description).toBe('Test description');
      expect(result.transcription).toBe('Test transcription');
      expect(result.user).toBe(mockUser);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should use default values when cloudinary data is missing', async () => {
      const mockUser = { id: 'user-456', email: 'test2@example.com' } as User;

      const cloudinaryData = {
        secure_url: 'https://cloudinary.com/video.mp4',
        public_id: 'cloudinary-id-456',
      };

      mockRepository.save.mockResolvedValue({
        id: '2',
        title: 'Untitled',
        format: 'video',
        link: 'https://cloudinary.com/video.mp4',
        duration: 0,
        publicId: 'cloudinary-id-456',
        score: 0,
        description: '',
        transcription: '',
        user: mockUser,
      } as Video);

      const result = await service.saveUploadedVideo(cloudinaryData, '', '', mockUser);

      expect(result.title).toBe('Untitled');
      expect(result.format).toBe('video');
      expect(result.duration).toBe(0);
      expect(result.description).toBe('');
      expect(result.transcription).toBe('');
      expect(result.user).toBe(mockUser);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should handle image uploads', async () => {
      const mockUser = { id: 'user-789', email: 'test3@example.com' } as User;

      const cloudinaryData = {
        original_filename: 'my-image',
        resource_type: 'image',
        secure_url: 'https://cloudinary.com/image.jpg',
        public_id: 'cloudinary-img-789',
      };

      mockRepository.save.mockResolvedValue({
        id: '3',
        title: 'my-image',
        format: 'image',
        link: 'https://cloudinary.com/image.jpg',
        duration: 0,
        publicId: 'cloudinary-img-789',
        score: 0,
        description: 'My image',
        transcription: '',
        user: mockUser,
      } as Video);

      const result = await service.saveUploadedVideo(
        cloudinaryData,
        'My image',
        '',
        mockUser,
      );

      expect(result.format).toBe('image');
      expect(result.description).toBe('My image');
      expect(result.user).toBe(mockUser);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });
});
