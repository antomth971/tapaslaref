import { Controller, Get, Query } from '@nestjs/common';
import { VideoService } from './video.service';

@Controller('video')
export class VideoController {
    constructor(private readonly videoService: VideoService) {}

    @Get('all')
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 15,
    ) {
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        return this.videoService.findPaginated(pageNumber, limitNumber);
    }
}