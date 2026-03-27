import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorReading } from './entity/sensorReading.entity';
import { SensorReadingController } from './sensorReading.controller';
import { SensorReadingService } from './services/sensorReading.service';
import { Room } from '../room/entity/room.entity';
import { Herb } from '../herb/entity/herb.entity';
import { GrowConditions } from '../growConditions/entity/growConditions.entity';
import { Notification } from '../notification/entity/notification.entity';
import { User } from '../user/entity/user.entity';
import { PumpCommand } from '../pumpCommand/entity/pumpCommand.entity';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SensorReading,
            Room,
            Herb,
            GrowConditions,
            Notification,
            User,
            PumpCommand,
        ]),
        EmailModule,
    ],
    controllers: [SensorReadingController],
    providers: [SensorReadingService],
    exports: [SensorReadingService],
})
export class SensorReadingModule {}
