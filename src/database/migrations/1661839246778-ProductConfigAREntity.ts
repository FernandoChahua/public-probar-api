/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductConfigAREntity1661839246778 implements MigrationInterface {
  name = 'ProductConfigAREntity1661839246778';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."product_config_ar_status_enum" AS ENUM('A', 'I')`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_config_ar" ("url_left_model" character varying(500) NOT NULL DEFAULT '', "url_right_model" character varying(500) NOT NULL DEFAULT '', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."product_config_ar_status_enum" NOT NULL DEFAULT 'A', "id" integer NOT NULL, CONSTRAINT "REL_791d826bd172be5509235893b2" UNIQUE ("id"), CONSTRAINT "PK_791d826bd172be5509235893b2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_config_ar" ADD CONSTRAINT "FK_791d826bd172be5509235893b2f" FOREIGN KEY ("id") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_config_ar" DROP CONSTRAINT "FK_791d826bd172be5509235893b2f"`,
    );
    await queryRunner.query(`DROP TABLE "product_config_ar"`);
    await queryRunner.query(
      `DROP TYPE "public"."product_config_ar_status_enum"`,
    );
  }
}
