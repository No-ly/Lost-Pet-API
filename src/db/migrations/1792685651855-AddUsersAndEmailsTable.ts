import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersAndEmailsTable1792685651855 implements MigrationInterface {
    name = 'AddUsersAndEmailsTable1792685651855'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "PENDING_EMAIL" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "payload" character varying NOT NULL, "isPending" boolean NOT NULL DEFAULT true, "subject" character varying NOT NULL, "to" character varying NOT NULL, CONSTRAINT "PK_01db8dd94ef7914d695da10f2c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "SYSTEM_USER" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "password" character varying(255) NOT NULL, "isPetAlertEnabled" boolean NOT NULL DEFAULT true, "location" geometry(Point,4326), "radius" integer NOT NULL DEFAULT '5', CONSTRAINT "UQ_5b250ddb22b3e4f8234ab172021" UNIQUE ("email"), CONSTRAINT "PK_3f5912604df1254054eac4f2b5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a7c9a5d691c88b278fc5dcd799" ON "SYSTEM_USER" USING gist ("location") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a7c9a5d691c88b278fc5dcd799"`);
        await queryRunner.query(`DROP TABLE "SYSTEM_USER"`);
        await queryRunner.query(`DROP TABLE "PENDING_EMAIL"`);
    }

}
