/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class Herb1768054475000 {
    name = 'Herb1768054475000'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "wateredAt" TIMESTAMP WITH TIME ZONE NOT NULL, "amountWater" double precision NOT NULL, "temperature" double precision NOT NULL, "notes" text, "herb_id" uuid, CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_notificationtype_enum" AS ENUM('warning', 'emergency')`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "notificationType" "public"."notifications_notificationtype_enum" NOT NULL, "message" text NOT NULL, "isRead" boolean NOT NULL, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."growConditions_soiltype_enum" AS ENUM('sandy', 'loamy', 'clay', 'other')`);
        await queryRunner.query(`CREATE TABLE "growConditions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "minTemperature" double precision NOT NULL, "maxTemperature" double precision NOT NULL, "minHumidity" double precision NOT NULL, "maxHumidity" double precision NOT NULL, "soilType" "public"."growConditions_soiltype_enum" NOT NULL DEFAULT 'loamy', "herb_id" uuid, CONSTRAINT "REL_ed36472959e1f45212bbcb9fea" UNIQUE ("herb_id"), CONSTRAINT "PK_49a2ad29504e719824e868d470b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "herb" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(256) NOT NULL, "description" text NOT NULL, "temperature" double precision NOT NULL, "humidity" double precision NOT NULL, "soilMoisture" double precision NOT NULL, "lastWatering" TIMESTAMP WITH TIME ZONE NOT NULL, "roomId" uuid, CONSTRAINT "PK_07061e729f9bf2d30ed5412d49e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" text, "temperature" double precision NOT NULL, "humidity" double precision NOT NULL, "waterLevel" double precision NOT NULL, CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "history" ADD CONSTRAINT "FK_c9d3f3c5dcf0b2e18d2f5f1997a" FOREIGN KEY ("herb_id") REFERENCES "herb"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "growConditions" ADD CONSTRAINT "FK_ed36472959e1f45212bbcb9fea2" FOREIGN KEY ("herb_id") REFERENCES "herb"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "herb" ADD CONSTRAINT "FK_b96a524ef11aea0a6e5e3a17241" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "herb" DROP CONSTRAINT "FK_b96a524ef11aea0a6e5e3a17241"`);
        await queryRunner.query(`ALTER TABLE "growConditions" DROP CONSTRAINT "FK_ed36472959e1f45212bbcb9fea2"`);
        await queryRunner.query(`ALTER TABLE "history" DROP CONSTRAINT "FK_c9d3f3c5dcf0b2e18d2f5f1997a"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "room"`);
        await queryRunner.query(`DROP TABLE "herb"`);
        await queryRunner.query(`DROP TABLE "growConditions"`);
        await queryRunner.query(`DROP TYPE "public"."growConditions_soiltype_enum"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_notificationtype_enum"`);
        await queryRunner.query(`DROP TABLE "history"`);
    }
}
