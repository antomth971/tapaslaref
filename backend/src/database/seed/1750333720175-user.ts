import { AppDataSource } from '../../data-source';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class User1750333720175 implements Seeder {
    track = false;

    public async run(
        dataSource: typeof AppDataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        console.log('Seeding User...');
        const UserRepository = dataSource.getRepository('User');
        await UserRepository.insert([
            {
                email: 'anthonymathieu21@live.fr',
                password: 'password',
            }])

    }
}
