module.exports = class AddHerbImageAndPlantType1768062000000 {
    name = 'AddHerbImageAndPlantType1768062000000'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "herb" ADD "imageUrl" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."herb_plant_type_enum" AS ENUM('herb', 'flower', 'vegetable', 'fruit', 'other')`);
        await queryRunner.query(`ALTER TABLE "herb" ADD "plantType" "public"."herb_plant_type_enum" NOT NULL DEFAULT 'herb'`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "herb" DROP COLUMN "plantType"`);
        await queryRunner.query(`DROP TYPE "public"."herb_plant_type_enum"`);
        await queryRunner.query(`ALTER TABLE "herb" DROP COLUMN "imageUrl"`);
    }
}
