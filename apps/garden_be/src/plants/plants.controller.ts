import { Controller, Get, Post, Body } from '@nestjs/common';
import { PlantsService } from './services/plants.service';

@Controller('plants')
export class PlantsController {
    constructor(private readonly plantsService: PlantsService) {}

    @Get()
    getAll() {
        return this.plantsService.findAll();
    }

    @Post()
    create(@Body('name') name: string) {
        return this.plantsService.create(name);
    }
}
