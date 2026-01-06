import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantsModule } from './plants/plants.module';
import { Plant } from './plants/entity/plant.entity';
import { PlantsService } from './plants/services/plants.service';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 5432,
            username: process.env.DB_USER || 'garden',
            password: process.env.DB_PASSWORD || 'secret',
            database: process.env.DB_NAME || 'garden',
            entities: [Plant],
            autoLoadEntities: true,
            synchronize: true,
        }),
        PlantsModule,
    ],
})
export class AppModule implements OnApplicationBootstrap {
    constructor(private readonly plantsService: PlantsService) {}

    async onApplicationBootstrap() {
        await this.plantsService.seedPlants();
    }
}
