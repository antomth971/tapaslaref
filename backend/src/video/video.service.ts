import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '../database/entity/video.entity';
import { User } from '../database/entity/user.entity';
@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
  ) { }

  findAll(): Promise<Video[]> {
    return this.videosRepository.find();
  }

  findOne(id: string): Promise<Video | null> {
    return this.videosRepository.findOneBy({ id });
  }

  async create(video: Video): Promise<Video> {
    return this.videosRepository.save(video);
  }

  async update(id: string, video: Video): Promise<Video> {
    await this.videosRepository.update(id, video);
    return this.videosRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.videosRepository.delete(id);
  }

  async findPaginated(
    page: number,
    limit: number,
  ): Promise<{ data: Video[]; total: number }> {
    const [data, total] = await this.videosRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        score: 'DESC',
      },
    });

    return { data, total };
  }
  /**
   * Prépare les données pour l'upload Cloudinary
   */
  prepareUploadData(
    file: Express.Multer.File,
    description: string,
    transcription: string,
  ) {
    return {
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      description: description || '',
      transcription: transcription || '',
    };
  }

  /**
   * Sauvegarde une vidéo après upload et modération réussie
   */
  async saveUploadedVideo(
    cloudinaryData: any,
    description: string,
    transcription: string,
    user: User
  ): Promise<Video> {
    const video = new Video();
    video.title = cloudinaryData.original_filename || 'Untitled';
    video.format = cloudinaryData.resource_type || 'video';
    video.link = cloudinaryData.secure_url;
    video.duration = cloudinaryData.duration || 0;
    video.publicId = cloudinaryData.public_id;
    video.score = 0;
    video.description = description || '';
    video.transcription = transcription || '';
    video.user = user;
    return this.videosRepository.save(video);
  }

  async findByUser(userId: string): Promise<Video[]> {
    return this.videosRepository.find({
      where: { user: { id: userId } },
      order: { score: 'DESC' }
    });
  }
}
