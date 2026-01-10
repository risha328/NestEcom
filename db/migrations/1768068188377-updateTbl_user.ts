import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTblUser1768068188377 implements MigrationInterface {
    name = 'UpdateTblUser1768068188377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
    }

}
