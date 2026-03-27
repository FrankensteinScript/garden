// ── Entity Types ──

export interface User {
  id: string;
  name: string;
  email: string;
  roomIds: string[];
  notificationIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  temperature: number;
  humidity: number;
  waterLevel: number;
  lightMode: LightMode;
  isLightOn: boolean;
  herbIds: string[];
  userIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Herb {
  id: string;
  name: string;
  description: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lastWatering: string;
  roomId?: string;
  notificationIds: string[];
  historyIds: string[];
  growConditionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface History {
  id: string;
  wateredAt: string;
  amountWater: number;
  temperature: number;
  notes?: string;
  herbId: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 'warning' | 'emergency';

export interface Notification {
  id: string;
  notificationType: NotificationType;
  message: string;
  isRead: boolean;
  herbIds: string[];
  userIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type SoilType = 'sandy' | 'loamy' | 'clay' | 'other';

export interface GrowConditions {
  id: string;
  minTemperature: number;
  maxTemperature: number;
  minHumidity: number;
  maxHumidity: number;
  soilType: SoilType;
  herbId: string;
  createdAt: string;
  updatedAt: string;
}

// ── Auth DTOs ──

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

// ── Create / Update Request DTOs ──

export interface RoomCreateRequest {
  name: string;
  description?: string;
  temperature: number;
  humidity: number;
  waterLevel: number;
}

export interface RoomUpdateRequest {
  name?: string;
  description?: string;
  temperature?: number;
  humidity?: number;
  waterLevel?: number;
}

export interface HerbCreateRequest {
  name: string;
  description: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lastWatering: string;
  roomId?: string;
  growConditionId: string;
}

export interface HerbUpdateRequest {
  name?: string;
  description?: string;
  temperature?: number;
  humidity?: number;
  soilMoisture?: number;
  lastWatering?: string;
  roomId?: string;
  growConditionId?: string;
}

export interface HistoryCreateRequest {
  wateredAt: string;
  amountWater: number;
  temperature: number;
  notes?: string;
  herbId: string;
}

export interface NotificationCreateRequest {
  notificationType: NotificationType;
  message: string;
  herbIds: string[];
  userIds: string[];
}

export interface GrowConditionsCreateRequest {
  minTemperature: number;
  maxTemperature: number;
  minHumidity: number;
  maxHumidity: number;
  soilType: SoilType;
  herbId: string;
}

export interface GrowConditionsUpdateRequest {
  minTemperature?: number;
  maxTemperature?: number;
  minHumidity?: number;
  maxHumidity?: number;
  soilType?: SoilType;
}

// ── Sensor Reading ──

export interface SensorReading {
  id: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  waterLevel: number;
  roomId: string;
  createdAt: string;
}

// ── Pump Command ──

export type PumpAction = 'on' | 'off';
export type PumpStatus = 'pending' | 'acknowledged' | 'completed';

export interface PumpCommand {
  id: string;
  action: PumpAction;
  durationSeconds?: number;
  status: PumpStatus;
  roomId: string;
  createdAt: string;
}

export interface PumpCommandRequest {
  action: PumpAction;
  durationSeconds?: number;
}

// ── Light Command ──

export type LightAction = 'on' | 'off';
export type LightMode = 'growth' | 'bloom' | 'off';
export type LightStatus = 'pending' | 'acknowledged' | 'completed';

export interface LightCommand {
  id: string;
  action: LightAction;
  mode: LightMode;
  status: LightStatus;
  roomId: string;
  createdAt: string;
}

export interface LightCommandRequest {
  action: LightAction;
  mode: LightMode;
}
