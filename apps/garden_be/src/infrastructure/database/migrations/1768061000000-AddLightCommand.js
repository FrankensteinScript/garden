module.exports = class AddLightCommand1768061000000 {
    name = 'AddLightCommand1768061000000'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."light_command_action_enum" AS ENUM('on', 'off')`);
        await queryRunner.query(`CREATE TYPE "public"."light_command_status_enum" AS ENUM('pending', 'acknowledged', 'completed')`);
        await queryRunner.query(`CREATE TYPE "public"."light_command_mode_enum" AS ENUM('growth', 'bloom', 'off')`);
        await queryRunner.query(`CREATE TYPE "public"."room_light_mode_enum" AS ENUM('growth', 'bloom', 'off')`);

        await queryRunner.query(`CREATE TABLE "light_command" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "action" "public"."light_command_action_enum" NOT NULL, "mode" "public"."light_command_mode_enum" NOT NULL DEFAULT 'growth', "status" "public"."light_command_status_enum" NOT NULL DEFAULT 'pending', "acknowledgedAt" TIMESTAMP WITH TIME ZONE, "room_id" uuid, CONSTRAINT "PK_light_command" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "light_command" ADD CONSTRAINT "FK_light_command_room" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE "room" ADD "lightMode" "public"."room_light_mode_enum" NOT NULL DEFAULT 'off'`);
        await queryRunner.query(`ALTER TABLE "room" ADD "isLightOn" boolean NOT NULL DEFAULT false`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "isLightOn"`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "lightMode"`);
        await queryRunner.query(`ALTER TABLE "light_command" DROP CONSTRAINT "FK_light_command_room"`);
        await queryRunner.query(`DROP TABLE "light_command"`);
        await queryRunner.query(`DROP TYPE "public"."room_light_mode_enum"`);
        await queryRunner.query(`DROP TYPE "public"."light_command_mode_enum"`);
        await queryRunner.query(`DROP TYPE "public"."light_command_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."light_command_action_enum"`);
    }
}
