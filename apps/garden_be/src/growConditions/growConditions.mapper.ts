import { GrowConditionsResponseDto } from './dtos/growConditionsResponse.dto';
import { GrowConditions } from './entity/growConditions.entity';

export const toGrowConditionsResponseDto = (
    growConditions: GrowConditions
): GrowConditionsResponseDto => ({
    minTemperature: growConditions.minTemperature,
    maxTemperature: growConditions.maxTemperature,
    minHumidity: growConditions.minHumidity,
    maxHumidity: growConditions.maxHumidity,
    soilType: growConditions.soilType,
    herbId: growConditions.herb.id,
});
