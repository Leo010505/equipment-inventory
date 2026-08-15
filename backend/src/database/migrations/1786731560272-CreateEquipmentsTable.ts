import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEquipmentsTable1786731560272 implements MigrationInterface {
    name = 'CreateEquipmentsTable1786731560272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."equipments_status_enum" AS ENUM('AVAILABLE', 'IN_USE', 'MAINTENANCE')`);
        await queryRunner.query(`CREATE TABLE "equipments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "description" text, "serialNumber" character varying NOT NULL, "status" "public"."equipments_status_enum" NOT NULL DEFAULT 'AVAILABLE', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "categoryId" uuid, CONSTRAINT "UQ_7d12d8b9d541c63f0c3e83669c7" UNIQUE ("serialNumber"), CONSTRAINT "PK_250348d5d9ae4946bcd634f3e61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "equipments" ADD CONSTRAINT "FK_62307bdbde64aff872a80f53d4a" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "equipments" DROP CONSTRAINT "FK_62307bdbde64aff872a80f53d4a"`);
        await queryRunner.query(`DROP TABLE "equipments"`);
        await queryRunner.query(`DROP TYPE "public"."equipments_status_enum"`);
    }

}
