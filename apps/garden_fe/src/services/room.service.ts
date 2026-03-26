import api from '@/lib/api';
import type { Room, RoomCreateRequest, RoomUpdateRequest } from '@/types/api';

export const roomService = {
  async getAll(): Promise<Room[]> {
    const response = await api.get<Room[]>('/room');
    return response.data;
  },

  async getById(id: string): Promise<Room> {
    const response = await api.get<Room>(`/room/${id}`);
    return response.data;
  },

  async create(data: RoomCreateRequest): Promise<Room> {
    const response = await api.post<Room>('/room', data);
    return response.data;
  },

  async update(id: string, data: RoomUpdateRequest): Promise<Room> {
    const response = await api.put<Room>(`/room/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/room/${id}`);
  },
};
