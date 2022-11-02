import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFileNameToConfig1661916225473 implements MigrationInterface {
  name = 'AddFileNameToConfig1661916225473';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_config_ar" ADD "file_left_model_name" character varying(500) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_config_ar" ADD "file_right_model_name" character varying(500) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_config_ar" DROP CONSTRAINT "FK_791d826bd172be5509235893b2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_config_ar" ADD CONSTRAINT "UQ_791d826bd172be5509235893b2f" UNIQUE ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_config_ar" ADD CONSTRAINT "FK_791d826bd172be5509235893b2f" FOREIGN KEY ("id") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_config_ar" DROP CONSTRAINT "FK_791d826bd172be5509235893b2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_config_ar" DROP CONSTRAINT "UQ_791d826bd172be5509235893b2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_config_ar" ADD CONSTRAINT "FK_791d826bd172be5509235893b2f" FOREIGN KEY ("id") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_config_ar" DROP COLUMN "file_right_model_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_config_ar" DROP COLUMN "file_left_model_name"`,
    );
  }
}
