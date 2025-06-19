import { AppDataSource } from '../../data-source';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class Video1750334691256 implements Seeder {
    track = false;

    public async run(
        dataSource: typeof AppDataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        console.log('Seeding Video...');
        const VideoRepository = dataSource.getRepository('Video');

    }
}
