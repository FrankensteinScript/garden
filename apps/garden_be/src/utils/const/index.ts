export const SOIL_TYPES = ['sandy', 'loamy', 'clay', 'other'] as const;
export type SoilType = (typeof SOIL_TYPES)[number];

export enum SoilTypeEnum {
    SANDY = 'sandy',
    LOAMY = 'loamy',
    CLAY = 'clay',
    OTHER = 'other',
}

export const NOTIFICATION_TYPES = ['warning', 'emergency'] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export enum NotificationTypeEnum {
    WARNING = 'warning',
    EMERGENCY = 'emergency',
}
