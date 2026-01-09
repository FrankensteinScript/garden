import { Room } from '../room/entity/room.entity';
import { RoomResponseDto } from './dtos/roomResponse.dto';

export const toRoomResponseDto = (room: Room): RoomResponseDto => ({
    id: room.id,
    name: room.name,
    description: room.description,
    temperature: room.temperature,
    humidity: room.humidity,
    waterLevel: room.waterLevel,
    herbIds: room.herbs?.map((h) => h.id) ?? [],
    userIds: room.user?.map((u) => u.id) ?? [],
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
});
