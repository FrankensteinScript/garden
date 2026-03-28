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

export const PUMP_ACTIONS = ['on', 'off'] as const;
export type PumpAction = (typeof PUMP_ACTIONS)[number];

export const PUMP_STATUSES = ['pending', 'acknowledged', 'completed'] as const;
export type PumpStatus = (typeof PUMP_STATUSES)[number];

export const LIGHT_ACTIONS = ['on', 'off'] as const;
export type LightAction = (typeof LIGHT_ACTIONS)[number];

export const LIGHT_STATUSES = ['pending', 'acknowledged', 'completed'] as const;
export type LightStatus = (typeof LIGHT_STATUSES)[number];

export const LIGHT_MODES = ['growth', 'bloom', 'off'] as const;
export type LightMode = (typeof LIGHT_MODES)[number];

export const PLANT_TYPES = ['herb', 'flower', 'vegetable', 'fruit', 'other'] as const;
export type PlantType = (typeof PLANT_TYPES)[number];
