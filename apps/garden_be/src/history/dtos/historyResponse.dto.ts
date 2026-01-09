export class HistoryResponseDto {
    id: string;
    wateredAt: Date;
    amountWater: number;
    temperature: number;
    notes?: string;
    herbId: string;
    createdAt: Date;
    updatedAt: Date;
}
