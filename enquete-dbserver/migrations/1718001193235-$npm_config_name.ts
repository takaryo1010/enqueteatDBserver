import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1718001193235 implements MigrationInterface {
    name = ' $npmConfigName1718001193235'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`form\` ADD \`form_administrator\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`form\` DROP COLUMN \`form_administrator\``);
    }

}
