import { Herb } from './entity/herb.entity';
import { HerbResponseDto } from './dtos/herbResponse.dto';

export const toHerbResponseDto = (herb: Herb): HerbResponseDto => ({
    id: herb.id,
    name: herb.name,
    description: herb.description,
    temperature: herb.temperature,
    humidity: herb.humidity,
    soilMoisture: herb.soilMoisture,
    lastWatering: herb.lastWatering,
    roomId: herb.room?.id,
    notificationIds: herb.notifications?.map((n) => n.id) ?? [],
    historyIds: herb.histories?.map((h) => h.id) ?? [],
    growConditionId: herb.growConditions.id,
    createdAt: herb.createdAt,
    updatedAt: herb.updatedAt,
});
