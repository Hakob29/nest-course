import { MigrationInterface, QueryRunner } from "typeorm";

export class userRolePost1676317250187 implements MigrationInterface {
    name = 'userRolePost1676317250187'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Post" ("id" BIGSERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "image" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "authorId" bigint, CONSTRAINT "UQ_0413860b3a8b5c4e6b8c6ebc392" UNIQUE ("title"), CONSTRAINT "PK_c4d3b3dcd73db0b0129ea829f9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "User" ("id" BIGSERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "banned" boolean NOT NULL DEFAULT false, "baReason" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Role" ("id" BIGSERIAL NOT NULL, "value" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_14afebe4d5ef154a991bfafb91c" UNIQUE ("value"), CONSTRAINT "PK_9309532197a7397548e341e5536" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "User-Roles-Table" ("userId" bigint NOT NULL, "roleId" bigint NOT NULL, CONSTRAINT "PK_203a84c70d671f732de89dfe206" PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a0891c0f503344b0e1696fd360" ON "User-Roles-Table" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cb9ae3ec9bd66485e292b02099" ON "User-Roles-Table" ("roleId") `);
        await queryRunner.query(`ALTER TABLE "Post" ADD CONSTRAINT "FK_cef8d6e8edb69c82e5f10bb4026" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "User-Roles-Table" ADD CONSTRAINT "FK_a0891c0f503344b0e1696fd3607" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "User-Roles-Table" ADD CONSTRAINT "FK_cb9ae3ec9bd66485e292b02099f" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User-Roles-Table" DROP CONSTRAINT "FK_cb9ae3ec9bd66485e292b02099f"`);
        await queryRunner.query(`ALTER TABLE "User-Roles-Table" DROP CONSTRAINT "FK_a0891c0f503344b0e1696fd3607"`);
        await queryRunner.query(`ALTER TABLE "Post" DROP CONSTRAINT "FK_cef8d6e8edb69c82e5f10bb4026"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cb9ae3ec9bd66485e292b02099"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a0891c0f503344b0e1696fd360"`);
        await queryRunner.query(`DROP TABLE "User-Roles-Table"`);
        await queryRunner.query(`DROP TABLE "Role"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TABLE "Post"`);
    }

}
