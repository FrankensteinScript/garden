import { Controller, Get } from '@nestjs/common';
import { PlantsService } from './services/plants.service';

@Controller('plants')
export class PlantsController {
    constructor(private readonly plantsService: PlantsService) {}

    @Get()
    getAll() {
        return this.plantsService.findAll();
    }
}
