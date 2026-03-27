module.exports = class AddRoomUserJoinTable1768060000000 {
    name = 'AddRoomUserJoinTable1768060000000'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "room_users_user" ("roomId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_room_users_user" PRIMARY KEY ("roomId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_room_users_roomId" ON "room_users_user" ("roomId")`);
        await queryRunner.query(`CREATE INDEX "IDX_room_users_userId" ON "room_users_user" ("userId")`);
        await queryRunner.query(`ALTER TABLE "room_users_user" ADD CONSTRAINT "FK_room_users_roomId" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "room_users_user" ADD CONSTRAINT "FK_room_users_userId" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "room_users_user" DROP CONSTRAINT "FK_room_users_userId"`);
        await queryRunner.query(`ALTER TABLE "room_users_user" DROP CONSTRAINT "FK_room_users_roomId"`);
        await queryRunner.query(`DROP INDEX "IDX_room_users_userId"`);
        await queryRunner.query(`DROP INDEX "IDX_room_users_roomId"`);
        await queryRunner.query(`DROP TABLE "room_users_user"`);
    }
}
