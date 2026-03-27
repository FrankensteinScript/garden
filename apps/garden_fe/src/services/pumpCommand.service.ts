import api from '@/lib/api';
import type { PumpCommand, PumpCommandRequest } from '@/types/api';

export const pumpCommandService = {
  async trigger(roomId: string, data: PumpCommandRequest): Promise<PumpCommand> {
    const response = await api.post<PumpCommand>(`/room/${roomId}/pump`, data);
    return response.data;
  },
};
