import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '../database/entity/video.entity';
@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(Video)
        private videosRepository: Repository<Video>,
    ) {}

    findAll(): Promise<Video[]> {
        return this.videosRepository.find();
    }

    findOne(id: number): Promise<Video | null> {
        return this.videosRepository.findOneBy({ id });
    }

    async create(video: Video): Promise<Video> {
        return this.videosRepository.save(video);
    }

    async update(id: number, video: Video): Promise<Video> {
        await this.videosRepository.update(id, video);
        return this.videosRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
        await this.videosRepository.delete(id);
    }

    async findPaginated(page: number, limit: number): Promise<{ data: Video[]; total: number }> {
        const [data, total] = await this.videosRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: {
                score: 'DESC',
            },
        });

        return { data, total };
    }
}
