import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Param,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CloudinaryService,
  ModerationType,
} from '../cloudinary/cloudinary.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../database/entity/user.entity';
@Controller('video')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('all')
  async findAll(@Query('page') page = 1, @Query('limit') limit = 15) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    return this.videoService.findPaginated(pageNumber, limitNumber);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('myvideos')
  async findMyVideos(@Request() req) {
    const userId = req.user.sub;
    return this.videoService.findByUser(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.videoService.findOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('description') description: string,
    @Body('transcription') transcription: string,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    try {
      const resourceType = file.mimetype.startsWith('image/')
        ? 'image'
        : 'video';
      const moderationType =
        resourceType === 'video'
          ? ModerationType.AWS_REKOGNITION_VIDEO
          : ModerationType.AWS_REKOGNITION;

      const uploadResult = await this.cloudinaryService.uploadAsset(
        file.buffer,
        {
          resource_type: resourceType,
          folder: 'tapaslaref',
          moderation: moderationType,
          tags: ['user_upload'],
          filename: file.originalname,
          mimetype: file.mimetype,
        },
      );

      let moderationStatus = uploadResult.moderation?.[0]?.status || 'pending';

      if (moderationStatus === 'pending') {
        try {
          moderationStatus = await this.waitForModerationResult(
            uploadResult.public_id,
            resourceType,
            60000,
            2000,
          );
        } catch (error) {
          console.error('⚠️ Moderation timeout - Deleting asset');

          await this.cloudinaryService.deleteAsset(
            uploadResult.public_id,
            resourceType,
          );

          throw new BadRequestException(
            'Moderation timeout: The content validation took too long. Please try again.',
          );
        }
      }

      if (moderationStatus === 'approved') {
        const user = new User();
        user.id = req.user.sub;

        const savedVideo = await this.videoService.saveUploadedVideo(
          uploadResult,
          description,
          transcription,
          user,
        );

        return {
          success: true,
          message: 'Video uploaded and approved',
          video: savedVideo,
        };
      } else if (moderationStatus === 'rejected') {
        await this.cloudinaryService.deleteAsset(
          uploadResult.public_id,
          resourceType,
        );

        throw new BadRequestException(
          'Content moderation failed: The uploaded content does not meet our community guidelines',
        );
      } else {
        console.error('⚠️ Unknown moderation status - Deleting asset');

        await this.cloudinaryService.deleteAsset(
          uploadResult.public_id,
          resourceType,
        );

        throw new BadRequestException(
          'Moderation error: Unknown status received',
        );
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw new BadRequestException(error.message || 'Failed to upload video');
    }
  }

  /**
   * Attend que la modération Cloudinary se termine (approved ou rejected)
   * @param publicId - ID public de l'asset sur Cloudinary
   * @param resourceType - Type de ressource (image ou video)
   * @param maxWaitTime - Temps maximum d'attente en ms (défaut: 60000ms = 60s)
   * @param pollingInterval - Intervalle entre chaque vérification en ms (défaut: 2000ms = 2s)
   * @returns Le statut final de modération ('approved' ou 'rejected')
   * @throws Error si le timeout est atteint
   */
  private async waitForModerationResult(
    publicId: string,
    resourceType: 'image' | 'video',
    maxWaitTime: number = 60000,
    pollingInterval: number = 2000,
  ): Promise<string> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      await new Promise((resolve) => setTimeout(resolve, pollingInterval));

      try {
        const assetDetails = await this.cloudinaryService.getAssetDetails(
          publicId,
          resourceType,
        );

        const moderationStatus = assetDetails.moderation?.[0]?.status;

        console.log(
          `Polling moderation status: ${moderationStatus} (${Math.round((Date.now() - startTime) / 1000)}s elapsed)`,
        );

        if (
          moderationStatus === 'approved' ||
          moderationStatus === 'rejected'
        ) {
          return moderationStatus;
        }
      } catch (error) {
        console.error('Error polling moderation status:', error.message);
      }
    }

    throw new Error('Moderation timeout exceeded');
  }
}
