import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTblUser1768068188377 implements MigrationInterface {
    name = 'UpdateTblUser1768068188377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if column exists before adding
        const columnExists = await queryRunner.query(`
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'updatedAt'
        `);
        
        if (columnExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
    }

}
