export class HerbResponseDto {
    id: string;
    name: string;
    description: string;
    temperature: number;
    humidity: number;
    soilMoisture: number;
    lastWatering: Date;
    roomId?: string;
    notificationIds: string[];
    historyIds: string[];
    growthConditionIds: string[];
    createdAt: Date;
    updatedAt: Date;
}
