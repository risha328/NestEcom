import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUpdatedAtToUsers1768068850004 implements MigrationInterface {
    name = 'AddUpdatedAtToUsers1768068850004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if column exists before adding
        const columnExists = await queryRunner.query(`
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'updatedAt'
        `);
        
        if (columnExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
    }

}
