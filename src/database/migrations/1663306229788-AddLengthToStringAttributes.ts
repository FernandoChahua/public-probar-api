import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLengthToStringAttributes1663306229788
  implements MigrationInterface
{
  name = 'AddLengthToStringAttributes1663306229788';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "brands" ADD "title" character varying(1000)`,
    );
    await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "brands" ADD "description" character varying(1000)`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "title" character varying(1000)`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "description" character varying(1000)`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP COLUMN "title"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD "title" character varying(1000) DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD "description" character varying(1000) DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "url_image" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "color_name" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "color_rgb" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "size" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "size" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "color_rgb" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "color_name" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ALTER COLUMN "url_image" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD "description" character varying(200) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP COLUMN "title"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD "title" character varying(100) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "description" character varying(200) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "title" character varying(100) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "brands" ADD "description" character varying(200)`,
    );
    await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "brands" ADD "title" character varying(100)`,
    );
  }
}
