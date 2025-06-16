import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1749123824346 implements MigrationInterface {
  name = 'Initial1749123824346';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "airport" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "iata" varchar NOT NULL, "unlocode" varchar NOT NULL, "country" varchar NOT NULL, "city" varchar NOT NULL)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "airport"`);
  }
}
