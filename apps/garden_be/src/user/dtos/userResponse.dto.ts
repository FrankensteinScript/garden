export class UserResponseDto {
    id: string;
    name: string;
    email: string;
    roomIds: string[];
    notificationIds: string[];
    createdAt: Date;
    updatedAt: Date;
}
