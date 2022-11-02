import { MigrationInterface, QueryRunner } from 'typeorm';

export class BrandUrlLogo1662863444303 implements MigrationInterface {
  name = 'BrandUrlLogo1662863444303';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brands" ADD "path_file_logo" character varying(400)`,
    );
    await queryRunner.query(
      `ALTER TABLE "brands" ADD "logo_filename" character varying(400)`,
    );
    await queryRunner.query(
      `ALTER TABLE "brands" ALTER COLUMN "title" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "brands" ALTER COLUMN "description" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "brands" ALTER COLUMN "url_logo_link" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "brands" ALTER COLUMN "url_logo_link" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "brands" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "brands" ALTER COLUMN "title" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "logo_filename"`);
    await queryRunner.query(
      `ALTER TABLE "brands" DROP COLUMN "path_file_logo"`,
    );
  }
}
