import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1716706624031 implements MigrationInterface {
    name = ' $npmConfigName1716706624031'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`form\` (\`form_id\` int NOT NULL AUTO_INCREMENT, \`form_title\` varchar(255) NOT NULL, PRIMARY KEY (\`form_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`choice\` (\`choice_id\` int NOT NULL AUTO_INCREMENT, \`choice_text\` varchar(255) NOT NULL, \`vote_counter\` int NOT NULL, \`questionQuestionId\` int NULL, PRIMARY KEY (\`choice_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`question\` (\`question_id\` int NOT NULL AUTO_INCREMENT, \`question_text\` varchar(255) NOT NULL, \`formFormId\` int NULL, PRIMARY KEY (\`question_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`choice\` ADD CONSTRAINT \`FK_03c8d32a1b4dec70bbf261d29c8\` FOREIGN KEY (\`questionQuestionId\`) REFERENCES \`question\`(\`question_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`question\` ADD CONSTRAINT \`FK_e438d7f9fc2a10bbe37b9e5c5d3\` FOREIGN KEY (\`formFormId\`) REFERENCES \`form\`(\`form_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`question\` DROP FOREIGN KEY \`FK_e438d7f9fc2a10bbe37b9e5c5d3\``);
        await queryRunner.query(`ALTER TABLE \`choice\` DROP FOREIGN KEY \`FK_03c8d32a1b4dec70bbf261d29c8\``);
        await queryRunner.query(`DROP TABLE \`question\``);
        await queryRunner.query(`DROP TABLE \`choice\``);
        await queryRunner.query(`DROP TABLE \`form\``);
    }

}
