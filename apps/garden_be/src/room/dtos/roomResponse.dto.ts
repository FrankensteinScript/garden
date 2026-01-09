export class RoomResponseDto {
    id: string;
    name: string;
    description?: string;
    temperature: number;
    humidity: number;
    waterLevel: number;
    herbIds: string[];
    userIds: string[];
    createdAt: Date;
    updatedAt: Date;
}
