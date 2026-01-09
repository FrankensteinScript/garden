import { User } from './entity/user.entity';
import { UserResponseDto } from './dtos/userResponse.dto';

export const toUserResponseDto = (user: User): UserResponseDto => ({
    id: user.id,
    name: user.name,
    email: user.email,
    roomIds: user.rooms?.map((r) => r.id) ?? [],
    notificationIds: user.notifications?.map((n) => n.id) ?? [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});
