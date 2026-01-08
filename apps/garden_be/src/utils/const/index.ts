export const SoilType = {
    SANDY: 'sandy',
    LOAMY: 'loamy',
    CLAY: 'clay',
    OTHER: 'other',
} as const;

export type SoilTypeEnum = typeof SoilType[keyof typeof SoilType];

export const NotificationType = {
    WARNING: 'warning',
    EMERGENCY: 'emergency',
} as const;

export type NotificationTypeEnum =
    typeof NotificationType[keyof typeof NotificationType];
