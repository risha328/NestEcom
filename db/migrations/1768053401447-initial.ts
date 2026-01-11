import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1768053401447 implements MigrationInterface {
    name = 'Initial1768053401447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if enum type exists before creating
        const enumExists = await queryRunner.query(`
            SELECT 1 FROM pg_type WHERE typname = 'users_roles_enum'
        `);
        
        if (enumExists.length === 0) {
            await queryRunner.query(`CREATE TYPE "users_roles_enum" AS ENUM('admin', 'user')`);
        }

        // Check if table exists before creating
        const tableExists = await queryRunner.query(`
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'users'
        `);

        if (tableExists.length === 0) {
            await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "roles" "public"."users_roles_enum" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    }

}
