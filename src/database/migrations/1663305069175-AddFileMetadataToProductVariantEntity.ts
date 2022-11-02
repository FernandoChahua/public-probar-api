import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFileMetadataToProductVariantEntity1663305069175
  implements MigrationInterface
{
  name = 'AddFileMetadataToProductVariantEntity1663305069175';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD "path_file_image" character varying(400) DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD "image_filename" character varying(400) DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP COLUMN "image_filename"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP COLUMN "path_file_image"`,
    );
  }
}
