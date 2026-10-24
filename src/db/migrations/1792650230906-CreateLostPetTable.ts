import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLostPetTable1792650230906 implements MigrationInterface {
    name = 'CreateLostPetTable1792650230906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "LOST_PET" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying(100) NOT NULL, "name" character varying(100) NOT NULL, "location" geometry(Point,4326) NOT NULL, "phone" character varying(20) NOT NULL, "race" character varying(100) NOT NULL, "age" integer NOT NULL, "color" character varying(50) NOT NULL, "ownerName" character varying(150) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7fda532c785dfc07c9c2a814365" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_045e103b0adcadb3d36d836361" ON "LOST_PET" USING gist ("location") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_045e103b0adcadb3d36d836361"`);
        await queryRunner.query(`DROP TABLE "LOST_PET"`);
    }

}
