
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Video } from './video.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Video, (video) => video.user)
  videos: Video[];
}
