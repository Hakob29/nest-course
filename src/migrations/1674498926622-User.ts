import { MigrationInterface, QueryRunner } from "typeorm";

export class User1674498926622 implements MigrationInterface {
    name = 'User1674498926622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "User" ("id" BIGSERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "banned" boolean NOT NULL DEFAULT false, "baReason" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "User"`);
    }

}
