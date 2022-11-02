/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class BrandEntity1661140774403 implements MigrationInterface {
  name = 'BrandEntity1661140774403';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."brands_status_enum" AS ENUM('A', 'I')`,
    );
    await queryRunner.query(
      `CREATE TABLE "brands" ("id" SERIAL NOT NULL, "title" character varying(100) NOT NULL, "description" character varying(200) NOT NULL, "url_logo_link" character varying(400) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."brands_status_enum" NOT NULL DEFAULT 'A', CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "products" ADD "brandId" integer`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_ea86d0c514c4ecbb5694cbf57df"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "brandId"`);
    await queryRunner.query(`DROP TABLE "brands"`);
    await queryRunner.query(`DROP TYPE "public"."brands_status_enum"`);
  }
}
