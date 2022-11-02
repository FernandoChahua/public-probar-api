import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLinkPreviewModel1663997336339 implements MigrationInterface {
    name = 'AddLinkPreviewModel1663997336339'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variants" ADD "link_preview_model_ar" character varying(1000) DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variants" DROP COLUMN "link_preview_model_ar"`);
    }

}
