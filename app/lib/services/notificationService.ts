import { apiClient } from '../utils/apiClient';

export interface Notification {
  _id: string;
  type: string[];
  message: string;
  by: {
    _id: string;
    username: string;
    name?: string;
    avatar?: string;
    title?: string;
  } | null;
  link: string;
  createdAt: string;
  readBy: string[];
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
}

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await apiClient.get('/notifications');
      return response;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Return empty array as fallback
      return [];
    }
  },

  async markAsRead(notificationId: string): Promise<Notification> {
    try {
      const response = await apiClient.put(`/notifications/${notificationId}/read`, {});
      return response;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  async createNotification(data: {
    type: string[];
    message: string;
    by?: string;
    link?: string;
  }): Promise<Notification> {
    try {
      const response = await apiClient.post('/notifications', data);
      return response.notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  async markAllAsRead(): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.put('/notifications/read-all', {});
      return response;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  async deleteNotification(notificationId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.delete(`/notifications/${notificationId}`);
      return response;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  async clearAll(): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.delete('/notifications/all');
      return response;
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      throw error;
    }
  },
  
  async getUnreadCount(): Promise<number> {
    try {
      const response = await apiClient.get('/notifications/unread-count');
      return response.count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
}; 