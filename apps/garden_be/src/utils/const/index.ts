export const SoilType = {
    SANDY: 'sandy',
    LOAMY: 'loamy',
    CLAY: 'clay',
    OTHER: 'other',
} as const;

export type SoilTypeEnum = typeof SoilType[keyof typeof SoilType];
