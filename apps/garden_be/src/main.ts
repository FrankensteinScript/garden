import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PlantsService } from './plants/services/plants.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const plantsService = app.get(PlantsService);
    await plantsService.seedPlants();
    const port = process.env.PORT || 3000;
    await app.listen(port);
    Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
