import { AppDataSource } from '../../data-source';
import { Seeder } from 'typeorm-extension';
import { hash } from 'bcrypt';
export class User1750333720175 implements Seeder {
  track = false;

  public async run(dataSource: typeof AppDataSource): Promise<any> {
    console.log('Seeding User...');
    const UserRepository = dataSource.getRepository('User');
    await UserRepository.insert([
      {
        email: 'anthonymathieu21@live.fr',
        password: await hash('password', 10),
      },
    ]);
    console.log('✅ Seed User terminé !');
  }
}
