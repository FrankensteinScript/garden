import api from '@/lib/api';
import type { SensorReading } from '@/types/api';

export const sensorReadingService = {
  async getByRoom(
    roomId: string,
    from?: string,
    to?: string,
    limit?: number
  ): Promise<SensorReading[]> {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (limit) params.set('limit', String(limit));
    const response = await api.get<SensorReading[]>(
      `/sensor-data/room/${roomId}?${params.toString()}`
    );
    return response.data;
  },

  async getLatest(roomId: string): Promise<SensorReading | null> {
    const response = await api.get<SensorReading | null>(
      `/sensor-data/room/${roomId}/latest`
    );
    return response.data;
  },
};
