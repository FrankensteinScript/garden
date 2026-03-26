import api from '@/lib/api';
import type {
  GrowConditions,
  GrowConditionsCreateRequest,
  GrowConditionsUpdateRequest,
} from '@/types/api';

export const growConditionsService = {
  async getById(id: string): Promise<GrowConditions> {
    const response = await api.get<GrowConditions>(`/growConditions/${id}`);
    return response.data;
  },

  async create(data: GrowConditionsCreateRequest): Promise<GrowConditions> {
    const response = await api.post<GrowConditions>('/growConditions', data);
    return response.data;
  },

  async update(id: string, data: GrowConditionsUpdateRequest): Promise<GrowConditions> {
    const response = await api.put<GrowConditions>(`/growConditions/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/growConditions/${id}`);
  },
};
