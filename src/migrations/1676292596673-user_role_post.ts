import { MigrationInterface, QueryRunner } from "typeorm";

export class userRolePost1676292596673 implements MigrationInterface {
    name = 'userRolePost1676292596673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Roles" ("id" BIGSERIAL NOT NULL, "value" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8c7aacb48bdfad11bb9cdd1b8fc" UNIQUE ("value"), CONSTRAINT "PK_efba48c6a0c7a9b6260f771b165" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "User" ("id" BIGSERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "banned" boolean NOT NULL DEFAULT false, "baReason" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Posts" ("id" BIGSERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "image" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "authorId" bigint, CONSTRAINT "UQ_9bd0c1ace0545f8d2e56e0b8396" UNIQUE ("title"), CONSTRAINT "PK_0f050d6d1112b2d07545b43f945" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "User-Roles-Table" ("userId" bigint NOT NULL, "rolesId" bigint NOT NULL, CONSTRAINT "PK_06b340dc65b2d2b49c53b5328c8" PRIMARY KEY ("userId", "rolesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a0891c0f503344b0e1696fd360" ON "User-Roles-Table" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4dedfb38da6c60f75293a2c66a" ON "User-Roles-Table" ("rolesId") `);
        await queryRunner.query(`ALTER TABLE "Posts" ADD CONSTRAINT "FK_0a5ccbeec3dcbd5d09beb34f795" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "User-Roles-Table" ADD CONSTRAINT "FK_a0891c0f503344b0e1696fd3607" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "User-Roles-Table" ADD CONSTRAINT "FK_4dedfb38da6c60f75293a2c66a2" FOREIGN KEY ("rolesId") REFERENCES "Roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User-Roles-Table" DROP CONSTRAINT "FK_4dedfb38da6c60f75293a2c66a2"`);
        await queryRunner.query(`ALTER TABLE "User-Roles-Table" DROP CONSTRAINT "FK_a0891c0f503344b0e1696fd3607"`);
        await queryRunner.query(`ALTER TABLE "Posts" DROP CONSTRAINT "FK_0a5ccbeec3dcbd5d09beb34f795"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4dedfb38da6c60f75293a2c66a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a0891c0f503344b0e1696fd360"`);
        await queryRunner.query(`DROP TABLE "User-Roles-Table"`);
        await queryRunner.query(`DROP TABLE "Posts"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TABLE "Roles"`);
    }

}