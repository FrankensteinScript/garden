import api from '@/lib/api';
import type { LightCommand, LightCommandRequest } from '@/types/api';

export const lightCommandService = {
  async trigger(roomId: string, data: LightCommandRequest): Promise<LightCommand> {
    const response = await api.post<LightCommand>(`/room/${roomId}/light`, data);
    return response.data;
  },

  async getStatus(roomId: string): Promise<{ isLightOn: boolean; lightMode: string }> {
    const response = await api.get<{ isLightOn: boolean; lightMode: string }>(`/room/${roomId}/light/status`);
    return response.data;
  },
};
