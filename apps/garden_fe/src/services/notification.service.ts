import api from '@/lib/api';
import type { Notification, NotificationCreateRequest } from '@/types/api';

export const notificationService = {
  async getAll(): Promise<Notification[]> {
    const response = await api.get<Notification[]>('/notification');
    return response.data;
  },

  async getById(id: string): Promise<Notification> {
    const response = await api.get<Notification>(`/notification/${id}`);
    return response.data;
  },

  async create(data: NotificationCreateRequest): Promise<Notification> {
    const response = await api.post<Notification>('/notification', data);
    return response.data;
  },

  async markAsRead(id: string): Promise<Notification> {
    const response = await api.put<Notification>(`/notification/${id}`);
    return response.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/notification/${id}`);
  },
};
