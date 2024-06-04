import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1717389914066 implements MigrationInterface {
    name = ' $npmConfigName1717389914066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`user_id\` int NOT NULL AUTO_INCREMENT, \`user_email\` varchar(255) NOT NULL, PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`form\` ADD \`userUserId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`form\` ADD CONSTRAINT \`FK_4dab14066894b8b108ceb23dd62\` FOREIGN KEY (\`userUserId\`) REFERENCES \`user\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`form\` DROP FOREIGN KEY \`FK_4dab14066894b8b108ceb23dd62\``);
        await queryRunner.query(`ALTER TABLE \`form\` DROP COLUMN \`userUserId\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
