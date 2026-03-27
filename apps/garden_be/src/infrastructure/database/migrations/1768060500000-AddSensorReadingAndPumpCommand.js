module.exports = class AddSensorReadingAndPumpCommand1768060500000 {
    name = 'AddSensorReadingAndPumpCommand1768060500000'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."pump_command_action_enum" AS ENUM('on', 'off')`);
        await queryRunner.query(`CREATE TYPE "public"."pump_command_status_enum" AS ENUM('pending', 'acknowledged', 'completed')`);

        await queryRunner.query(`CREATE TABLE "sensor_reading" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "temperature" double precision NOT NULL, "humidity" double precision NOT NULL, "soilMoisture" double precision NOT NULL, "waterLevel" double precision NOT NULL, "room_id" uuid, CONSTRAINT "PK_sensor_reading" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_sensor_reading_room_created" ON "sensor_reading" ("room_id", "createdAt")`);
        await queryRunner.query(`ALTER TABLE "sensor_reading" ADD CONSTRAINT "FK_sensor_reading_room" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

        await queryRunner.query(`CREATE TABLE "pump_command" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "action" "public"."pump_command_action_enum" NOT NULL, "durationSeconds" integer, "status" "public"."pump_command_status_enum" NOT NULL DEFAULT 'pending', "acknowledgedAt" TIMESTAMP WITH TIME ZONE, "room_id" uuid, CONSTRAINT "PK_pump_command" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pump_command" ADD CONSTRAINT "FK_pump_command_room" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "pump_command" DROP CONSTRAINT "FK_pump_command_room"`);
        await queryRunner.query(`DROP TABLE "pump_command"`);
        await queryRunner.query(`DROP TYPE "public"."pump_command_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pump_command_action_enum"`);
        await queryRunner.query(`DROP INDEX "IDX_sensor_reading_room_created"`);
        await queryRunner.query(`ALTER TABLE "sensor_reading" DROP CONSTRAINT "FK_sensor_reading_room"`);
        await queryRunner.query(`DROP TABLE "sensor_reading"`);
    }
}
