import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMovementsTable1786731675334 implements MigrationInterface {
    name = 'CreateMovementsTable1786731675334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."movements_action_enum" AS ENUM('CHECK_OUT', 'RETURN')`);
        await queryRunner.query(`CREATE TABLE "movements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "action" "public"."movements_action_enum" NOT NULL DEFAULT 'CHECK_OUT', "notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "equipmentId" uuid, "userId" uuid, CONSTRAINT "PK_5a8e3da15ab8f2ce353e7f58f67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "movements" ADD CONSTRAINT "FK_5eb8bd2cf2599e16294ef5b794b" FOREIGN KEY ("equipmentId") REFERENCES "equipments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movements" ADD CONSTRAINT "FK_bc0744a4640b6cc68be91d25dec" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movements" DROP CONSTRAINT "FK_bc0744a4640b6cc68be91d25dec"`);
        await queryRunner.query(`ALTER TABLE "movements" DROP CONSTRAINT "FK_5eb8bd2cf2599e16294ef5b794b"`);
        await queryRunner.query(`DROP TABLE "movements"`);
        await queryRunner.query(`DROP TYPE "public"."movements_action_enum"`);
    }

}
