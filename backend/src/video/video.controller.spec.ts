import { Test, TestingModule } from '@nestjs/testing';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import {
  CloudinaryService,
  ModerationType,
} from '../cloudinary/cloudinary.service';
import { BadRequestException } from '@nestjs/common';

describe('VideoController', () => {
  let controller: VideoController;
  let videoService: VideoService;
  let cloudinaryService: CloudinaryService;

  const mockVideoService = {
    findPaginated: jest.fn(),
    findOne: jest.fn(),
    saveUploadedVideo: jest.fn(),
  };

  const mockCloudinaryService = {
    uploadAsset: jest.fn(),
    deleteAsset: jest.fn(),
    getAssetDetails: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [
        { provide: VideoService, useValue: mockVideoService },
        { provide: CloudinaryService, useValue: mockCloudinaryService },
      ],
    }).compile();

    controller = module.get<VideoController>(VideoController);
    videoService = module.get<VideoService>(VideoService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Ensure real timers are restored after each test
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated videos with default params', async () => {
      const mockResult = {
        data: [
          { id: '1', title: 'Video 1' },
          { id: '2', title: 'Video 2' },
        ],
        total: 2,
      };
      mockVideoService.findPaginated.mockResolvedValue(mockResult);

      const result = await controller.findAll(1, 15);

      expect(result).toEqual(mockResult);
      expect(mockVideoService.findPaginated).toHaveBeenCalledWith(1, 15);
    });

    it('should handle custom page and limit', async () => {
      const mockResult = {
        data: [{ id: '3', title: 'Video 3' }],
        total: 50,
      };
      mockVideoService.findPaginated.mockResolvedValue(mockResult);

      const result = await controller.findAll(3, 10);

      expect(result).toEqual(mockResult);
      expect(mockVideoService.findPaginated).toHaveBeenCalledWith(3, 10);
    });

    it('should convert string params to numbers', async () => {
      const mockResult = { data: [], total: 0 };
      mockVideoService.findPaginated.mockResolvedValue(mockResult);

      await controller.findAll('5' as any, '20' as any);

      expect(mockVideoService.findPaginated).toHaveBeenCalledWith(5, 20);
    });
  });

  describe('findOne', () => {
    it('should return a video by id', async () => {
      const mockVideo = { id: '123', title: 'Test Video' };
      mockVideoService.findOne.mockResolvedValue(mockVideo);

      const result = await controller.findOne('123');

      expect(result).toEqual(mockVideo);
      expect(mockVideoService.findOne).toHaveBeenCalledWith('123');
    });

    it('should return null for non-existent video', async () => {
      mockVideoService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('999');

      expect(result).toBeNull();
      expect(mockVideoService.findOne).toHaveBeenCalledWith('999');
    });
  });

  describe('upload', () => {
    const mockFile = {
      buffer: Buffer.from('test'),
      originalname: 'test.mp4',
      mimetype: 'video/mp4',
      size: 1024,
    } as Express.Multer.File;

    const mockImageFile = {
      buffer: Buffer.from('test'),
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      size: 512,
    } as Express.Multer.File;

    const mockRequest = {
      user: {
        sub: 'user-123',
        username: 'test@example.com',
      },
    };

    it('should throw error when no file is provided', async () => {
      await expect(
        controller.upload(null, 'description', 'transcription', mockRequest),
      ).rejects.toThrow(BadRequestException);
    });

    it('should successfully upload and approve video immediately', async () => {
      const uploadResult = {
        public_id: 'test-video-id',
        secure_url: 'https://cloudinary.com/video.mp4',
        resource_type: 'video',
        moderation: [{ status: 'approved' }],
        original_filename: 'test',
        duration: 120,
      };

      const savedVideo = {
        id: '1',
        title: 'test',
        format: 'video',
        link: 'https://cloudinary.com/video.mp4',
        publicId: 'test-video-id',
      };

      mockCloudinaryService.uploadAsset.mockResolvedValue(uploadResult);
      mockVideoService.saveUploadedVideo.mockResolvedValue(savedVideo);

      const result = await controller.upload(
        mockFile,
        'Test description',
        'Test transcription',
        mockRequest,
      );

      expect(result).toEqual({
        success: true,
        message: 'Video uploaded and approved',
        video: savedVideo,
      });
      expect(mockCloudinaryService.uploadAsset).toHaveBeenCalledWith(
        mockFile.buffer,
        expect.objectContaining({
          resource_type: 'video',
          folder: 'tapaslaref',
          moderation: ModerationType.AWS_REKOGNITION_VIDEO,
        }),
      );
      expect(mockVideoService.saveUploadedVideo).toHaveBeenCalledWith(
        uploadResult,
        'Test description',
        'Test transcription',
      );
      expect(mockCloudinaryService.deleteAsset).not.toHaveBeenCalled();
    });

    it('should reject and delete video when moderation fails immediately', async () => {
      const uploadResult = {
        public_id: 'rejected-video-id',
        secure_url: 'https://cloudinary.com/rejected.mp4',
        resource_type: 'video',
        moderation: [{ status: 'rejected' }],
      };

      mockCloudinaryService.uploadAsset.mockResolvedValue(uploadResult);
      mockCloudinaryService.deleteAsset.mockResolvedValue({ result: 'ok' });

      await expect(
        controller.upload(
          mockFile,
          'description',
          'transcription',
          mockRequest,
        ),
      ).rejects.toThrow(BadRequestException);

      expect(mockCloudinaryService.deleteAsset).toHaveBeenCalledWith(
        'rejected-video-id',
        'video',
      );
      expect(mockVideoService.saveUploadedVideo).not.toHaveBeenCalled();
    });

    it('should handle pending moderation that gets approved', async () => {
      jest.useFakeTimers();

      const uploadResult = {
        public_id: 'pending-video-id',
        secure_url: 'https://cloudinary.com/pending.mp4',
        resource_type: 'video',
        moderation: [{ status: 'pending' }],
        original_filename: 'pending-video',
        duration: 60,
      };

      const approvedDetails = {
        public_id: 'pending-video-id',
        moderation: [{ status: 'approved' }],
      };

      const savedVideo = {
        id: '2',
        title: 'pending-video',
        format: 'video',
      };

      mockCloudinaryService.uploadAsset.mockResolvedValue(uploadResult);
      mockCloudinaryService.getAssetDetails.mockResolvedValue(approvedDetails);
      mockVideoService.saveUploadedVideo.mockResolvedValue(savedVideo);

      const uploadPromise = controller.upload(
        mockFile,
        'desc',
        'trans',
        mockRequest,
      );

      // Advance timers to trigger the polling
      await jest.advanceTimersByTimeAsync(3000);

      const result = await uploadPromise;

      expect(result).toEqual({
        success: true,
        message: 'Video uploaded and approved',
        video: savedVideo,
      });
      expect(mockCloudinaryService.getAssetDetails).toHaveBeenCalled();
      expect(mockVideoService.saveUploadedVideo).toHaveBeenCalled();
    });

    it('should handle pending moderation that gets rejected', async () => {
      jest.useFakeTimers();

      const uploadResult = {
        public_id: 'pending-reject-id',
        secure_url: 'https://cloudinary.com/pending-reject.mp4',
        resource_type: 'video',
        moderation: [{ status: 'pending' }],
      };

      const rejectedDetails = {
        public_id: 'pending-reject-id',
        moderation: [{ status: 'rejected' }],
      };

      mockCloudinaryService.uploadAsset.mockResolvedValue(uploadResult);
      mockCloudinaryService.getAssetDetails.mockResolvedValue(rejectedDetails);
      mockCloudinaryService.deleteAsset.mockResolvedValue({ result: 'ok' });

      const uploadPromise = controller.upload(
        mockFile,
        'desc',
        'trans',
        mockRequest,
      );

      // Advance timers to trigger the polling
      await jest.advanceTimersByTimeAsync(3000);

      await expect(uploadPromise).rejects.toThrow(BadRequestException);

      expect(mockCloudinaryService.getAssetDetails).toHaveBeenCalled();
      expect(mockCloudinaryService.deleteAsset).toHaveBeenCalledWith(
        'pending-reject-id',
        'video',
      );
      expect(mockVideoService.saveUploadedVideo).not.toHaveBeenCalled();
    });

    it('should timeout and delete asset if moderation takes too long', async () => {
      jest.useFakeTimers();

      const uploadResult = {
        public_id: 'timeout-id',
        secure_url: 'https://cloudinary.com/timeout.mp4',
        resource_type: 'video',
        moderation: [{ status: 'pending' }],
      };

      const pendingDetails = {
        public_id: 'timeout-id',
        moderation: [{ status: 'pending' }],
      };

      mockCloudinaryService.uploadAsset.mockResolvedValue(uploadResult);
      // Always return pending to simulate timeout
      mockCloudinaryService.getAssetDetails.mockResolvedValue(pendingDetails);
      mockCloudinaryService.deleteAsset.mockResolvedValue({ result: 'ok' });

      const uploadPromise = controller.upload(
        mockFile,
        'desc',
        'trans',
        mockRequest,
      );

      // Fast-forward time to trigger timeout (more than 60s)
      await jest.advanceTimersByTimeAsync(65000);

      await expect(uploadPromise).rejects.toThrow(BadRequestException);

      expect(mockCloudinaryService.deleteAsset).toHaveBeenCalledWith(
        'timeout-id',
        'video',
      );
    });

    it('should upload and approve image with correct moderation type', async () => {
      const uploadResult = {
        public_id: 'test-image-id',
        secure_url: 'https://cloudinary.com/image.jpg',
        resource_type: 'image',
        moderation: [{ status: 'approved' }],
        original_filename: 'test-image',
      };

      const savedVideo = {
        id: '3',
        title: 'test-image',
        format: 'image',
      };

      mockCloudinaryService.uploadAsset.mockResolvedValue(uploadResult);
      mockVideoService.saveUploadedVideo.mockResolvedValue(savedVideo);

      const result = await controller.upload(
        mockImageFile,
        'Image desc',
        '',
        mockRequest,
      );

      expect(result).toEqual({
        success: true,
        message: 'Video uploaded and approved',
        video: savedVideo,
      });
      expect(mockCloudinaryService.uploadAsset).toHaveBeenCalledWith(
        mockImageFile.buffer,
        expect.objectContaining({
          resource_type: 'image',
          moderation: ModerationType.AWS_REKOGNITION,
        }),
      );
    });

    it('should handle upload error', async () => {
      mockCloudinaryService.uploadAsset.mockRejectedValue(
        new Error('Upload failed'),
      );

      await expect(
        controller.upload(mockFile, 'desc', 'trans', mockRequest),
      ).rejects.toThrow(BadRequestException);

      expect(mockVideoService.saveUploadedVideo).not.toHaveBeenCalled();
    });

    it('should handle empty description and transcription', async () => {
      const uploadResult = {
        public_id: 'no-desc-id',
        secure_url: 'https://cloudinary.com/no-desc.mp4',
        resource_type: 'video',
        moderation: [{ status: 'approved' }],
        original_filename: 'no-desc',
        duration: 30,
      };

      const savedVideo = {
        id: '4',
        title: 'no-desc',
      };

      mockCloudinaryService.uploadAsset.mockResolvedValue(uploadResult);
      mockVideoService.saveUploadedVideo.mockResolvedValue(savedVideo);

      const result = await controller.upload(mockFile, '', '', mockRequest);

      expect(result.success).toBe(true);
      expect(mockVideoService.saveUploadedVideo).toHaveBeenCalled();
    });
  });

  describe('waitForModerationResult (private method behavior)', () => {
    it('should poll and detect approved status', async () => {
      jest.useFakeTimers();

      const mockFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.mp4',
        mimetype: 'video/mp4',
        size: 1024,
      } as Express.Multer.File;

      const uploadResult = {
        public_id: 'polling-test-id',
        secure_url: 'https://cloudinary.com/polling.mp4',
        resource_type: 'video',
        moderation: [{ status: 'pending' }],
        original_filename: 'polling-test',
        duration: 45,
      };

      const approvedDetails = {
        public_id: 'polling-test-id',
        moderation: [{ status: 'approved' }],
      };

      const savedVideo = {
        id: '5',
        title: 'polling-test',
      };

      mockCloudinaryService.uploadAsset.mockResolvedValue(uploadResult);
      mockCloudinaryService.getAssetDetails.mockResolvedValue(approvedDetails);
      mockVideoService.saveUploadedVideo.mockResolvedValue(savedVideo);

      const uploadPromise = controller.upload(
        mockFile,
        'polling test',
        '',
        mockRequest,
      );

      // Advance timers to allow polling to occur
      await jest.advanceTimersByTimeAsync(3000);

      const result = await uploadPromise;

      expect(result.success).toBe(true);
      expect(mockCloudinaryService.getAssetDetails).toHaveBeenCalledWith(
        'polling-test-id',
        'video',
      );
    });

    it('should continue polling on getAssetDetails error', async () => {
      jest.useFakeTimers();

      const mockFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.mp4',
        mimetype: 'video/mp4',
        size: 1024,
      } as Express.Multer.File;

      const uploadResult = {
        public_id: 'error-polling-id',
        secure_url: 'https://cloudinary.com/error.mp4',
        resource_type: 'video',
        moderation: [{ status: 'pending' }],
        original_filename: 'error-polling',
        duration: 30,
      };

      const approvedDetails = {
        public_id: 'error-polling-id',
        moderation: [{ status: 'approved' }],
      };

      const savedVideo = {
        id: '6',
        title: 'error-polling',
      };

      mockCloudinaryService.uploadAsset.mockResolvedValue(uploadResult);
      // First call fails, second succeeds
      mockCloudinaryService.getAssetDetails
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(approvedDetails);
      mockVideoService.saveUploadedVideo.mockResolvedValue(savedVideo);

      const uploadPromise = controller.upload(
        mockFile,
        'error test',
        '',
        mockRequest,
      );

      // Advance timers to allow first polling attempt (which will fail)
      await jest.advanceTimersByTimeAsync(3000);

      // Advance timers again to allow second polling attempt (which will succeed)
      await jest.advanceTimersByTimeAsync(3000);

      const result = await uploadPromise;

      expect(result.success).toBe(true);
      expect(mockCloudinaryService.getAssetDetails).toHaveBeenCalledTimes(2);
    });
  });
});
