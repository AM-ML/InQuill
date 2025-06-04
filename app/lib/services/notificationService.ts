import { apiClient } from '../utils/apiClient';

export interface Notification {
  _id: string;
  userId: string;
  type: 'article_published' | 'comment' | 'like' | 'mention' | 'follow' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: {
    articleId?: string;
    commentId?: string;
    userId?: string;
    url?: string;
    [key: string]: any;
  };
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
}

export const notificationService = {
  async getNotifications(
    params: { page?: number; limit?: number; unreadOnly?: boolean } = {}
  ): Promise<NotificationsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) {
        queryParams.append('page', params.page.toString());
      }
      
      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      
      if (params.unreadOnly) {
        queryParams.append('unreadOnly', 'true');
      }
      
      const query = queryParams.toString();
      const endpoint = `/notifications${query ? `?${query}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Return empty response as fallback
      return {
        notifications: [],
        unreadCount: 0,
        total: 0
      };
    }
  },

  async markAsRead(notificationId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.put(`/notifications/${notificationId}/read`, {});
      return response;
    } catch (error) {
      console.error('Error marking notification as read:', error);
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