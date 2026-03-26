import api from '@/lib/api';
import type { Herb, HerbCreateRequest, HerbUpdateRequest } from '@/types/api';

export const herbService = {
  async getAll(): Promise<Herb[]> {
    const response = await api.get<Herb[]>('/herb');
    return response.data;
  },

  async getById(id: string): Promise<Herb> {
    const response = await api.get<Herb>(`/herb/${id}`);
    return response.data;
  },

  async create(data: HerbCreateRequest): Promise<Herb> {
    const response = await api.post<Herb>('/herb', data);
    return response.data;
  },

  async update(id: string, data: HerbUpdateRequest): Promise<Herb> {
    const response = await api.put<Herb>(`/herb/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/herb/${id}`);
  },
};
