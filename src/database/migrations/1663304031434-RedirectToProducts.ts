import { MigrationInterface, QueryRunner } from 'typeorm';

export class RedirectToProducts1663304031434 implements MigrationInterface {
  name = 'RedirectToProducts1663304031434';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD "redirect_to_url_shop" character varying(1000) NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "redirect_to_url_shop"`,
    );
  }
}
