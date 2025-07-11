import { Controller, Get } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Get('media')
  async getMedia() {
    const resources = await this.cloudinaryService.listMedia();

    return resources.map((media) => ({
      url: media.secure_url,
      public_id: media.public_id,
      format: media.format,
      resource_type: media.resource_type,
      duration: media.duration ?? null,
    }));
  }
}
