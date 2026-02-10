import { History } from './entity/history.entity';
import { HistoryResponseDto } from './dtos/historyResponse.dto';

export const toHistoryResponseDto = (history: History): HistoryResponseDto => ({
    id: history.id,
    wateredAt: history.wateredAt,
    amountWater: history.amountWater,
    temperature: history.temperature,
    notes: history.notes,
    herbId: history.herb.id,
    createdAt: history.createdAt,
    updatedAt: history.updatedAt,
});
