import { MigrationInterface, QueryRunner } from 'typeorm';

export class Video1750326904858 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //add index to video table
    queryRunner.query(`
            CREATE INDEX IF NOT EXISTS video_user_description_index ON video (description);
        `);
    queryRunner.query(`
            CREATE INDEX IF NOT EXISTS video_user_transcription_index ON video (transcription);
        `);
    console.log('Migration 1750326904858: Added indexes to video table');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //remove index from video table
    queryRunner.query(`
            DROP INDEX IF EXISTS video_user_description_index;
        `);
    queryRunner.query(`
            DROP INDEX IF EXISTS video_user_transcription_index;
        `);
  }
}
