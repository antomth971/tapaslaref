import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { Video } from '../database/entity/video.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [VideoService],
  controllers: [VideoController],
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([Video])],
})
export class VideoModule {}
