/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductVariant1661752087143 implements MigrationInterface {
  name = 'ProductVariant1661752087143';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favorites" DROP CONSTRAINT "FK_0c7bba48aac77ad13092685ba5b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" RENAME COLUMN "productId" TO "productVariantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" RENAME CONSTRAINT "PK_783e5111df14529ff6124351b16" TO "PK_4f74d7b7770137992ad919fb2ce"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."product_variants_status_enum" AS ENUM('A', 'I')`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_variants" ("id" SERIAL NOT NULL, "title" character varying(100) NOT NULL DEFAULT '', "description" character varying(200) NOT NULL DEFAULT '', "url_image" character varying(300) NOT NULL DEFAULT '', "color_name" character varying(50) NOT NULL DEFAULT '', "color_rgb" character varying(30) NOT NULL DEFAULT '', "size" character varying(30) NOT NULL DEFAULT '', "price" numeric NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."product_variants_status_enum" NOT NULL DEFAULT 'A', "productId" integer, CONSTRAINT "PK_281e3f2c55652d6a22c0aa59fd7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD CONSTRAINT "FK_f515690c571a03400a9876600b5" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_ef892b1f28c64999cced109ec6b" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favorites" DROP CONSTRAINT "FK_ef892b1f28c64999cced109ec6b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP CONSTRAINT "FK_f515690c571a03400a9876600b5"`,
    );
    await queryRunner.query(`DROP TABLE "product_variants"`);
    await queryRunner.query(
      `DROP TYPE "public"."product_variants_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" RENAME CONSTRAINT "PK_4f74d7b7770137992ad919fb2ce" TO "PK_783e5111df14529ff6124351b16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" RENAME COLUMN "productVariantId" TO "productId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites" ADD CONSTRAINT "FK_0c7bba48aac77ad13092685ba5b" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
