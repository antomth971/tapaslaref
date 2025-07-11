
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
@Entity()
export class Video {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  title: string;

  @Column()
  link: string;

  @Column()
  description: string;

  @Column()
  transcription: string;

  @Column('float')
  duration: number;

  @Column()
  format: string;

  @Column()
  publicId: string;

  @Column()
  score: number;

  @ManyToOne(() => User, (user) => user.videos)
  user: User;

}
