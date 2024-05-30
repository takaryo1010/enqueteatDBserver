import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1717039323979 implements MigrationInterface {
    name = ' $npmConfigName1717039323979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`choice\` CHANGE \`vote_counter\` \`vote_counter\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`choice\` CHANGE \`vote_counter\` \`vote_counter\` int NOT NULL`);
    }

}
