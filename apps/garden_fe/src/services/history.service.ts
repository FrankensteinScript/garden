import api from '@/lib/api';
import type { History, HistoryCreateRequest } from '@/types/api';

export const historyService = {
  async getAll(): Promise<History[]> {
    const response = await api.get<History[]>('/history');
    return response.data;
  },

  async getById(id: string): Promise<History> {
    const response = await api.get<History>(`/history/${id}`);
    return response.data;
  },

  async create(data: HistoryCreateRequest): Promise<History> {
    const response = await api.post<History>('/history', data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/history/${id}`);
  },
};
