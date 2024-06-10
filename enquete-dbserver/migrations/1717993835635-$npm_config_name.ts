import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1717993835635 implements MigrationInterface {
    name = ' $npmConfigName1717993835635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`text_answer\` (\`answer_id\` int NOT NULL AUTO_INCREMENT, \`text\` varchar(255) NOT NULL, \`choiceChoiceId\` int NULL, PRIMARY KEY (\`answer_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`question\` ADD \`question_type\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`text_answer\` ADD CONSTRAINT \`FK_39924efc02827510930677f8c65\` FOREIGN KEY (\`choiceChoiceId\`) REFERENCES \`choice\`(\`choice_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`text_answer\` DROP FOREIGN KEY \`FK_39924efc02827510930677f8c65\``);
        await queryRunner.query(`ALTER TABLE \`question\` DROP COLUMN \`question_type\``);
        await queryRunner.query(`DROP TABLE \`text_answer\``);
    }

}
