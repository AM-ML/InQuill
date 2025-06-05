import { API_URL } from '../constants';
import { apiClient } from '../utils/apiClient';
import { setAuthToken } from '../utils/authUtils';
import type { UserRole } from '../constants';

interface User {
  _id: string;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  role: UserRole;
  avatar?: string;
  title?: string;
}

interface ProfileUpdateData {
  username?: string;
  email?: string;
  name?: string;
  bio?: string;
  title?: string;
  avatar?: string;
}

interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

interface NotificationSettings {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  articleUpdates?: boolean;
  weeklyDigest?: boolean;
  commentNotifications?: boolean;
  likeNotifications?: boolean;
}

interface UserStatistics {
  totalArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

export const userService = {
  async updateProfile(profileData: ProfileUpdateData): Promise<User> {
    try {
      const response = await apiClient.put('/users/profile', profileData);
      
      // If the response contains a token, update it in storage
      if (response.token) {
        setAuthToken(response.token, true);
      }
      
      return response.user;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  async uploadAvatar(file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await apiClient.uploadFile('/uploads/avatar', formData);
      return { url: response.url };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },

  async updatePassword(passwordData: PasswordUpdateData): Promise<{ message: string }> {
    try {
      const response = await apiClient.put('/users/password', passwordData);
      return response;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },

  async updateNotificationSettings(settings: NotificationSettings): Promise<{ message: string }> {
    try {
      const response = await apiClient.put('/users/notifications', settings);
      return response;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  },

  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const response = await apiClient.get('/users/notifications');
      return response;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      // Return default settings as fallback
      return {
        emailNotifications: true,
        pushNotifications: false,
        articleUpdates: true,
        weeklyDigest: true,
        commentNotifications: true,
        likeNotifications: false
      };
    }
  },

  async getUserStatistics(): Promise<UserStatistics> {
    try {
      // Call the API endpoint for user statistics
      const response = await apiClient.get('/users/statistics');
      
      // If the response has the expected structure, return it
      if (response && 
          typeof response.totalArticles === 'number' && 
          typeof response.totalViews === 'number' && 
          typeof response.totalLikes === 'number' && 
          typeof response.totalComments === 'number') {
        return response;
      }

      // If the endpoint doesn't support detailed statistics, try to build them from separate endpoints
      const articlesParams = {
        limit: 1000, // Get a large number to calculate stats
        authorId: 'me', // Special identifier for the current user's articles
      };
      
      // Get user's articles to calculate stats
      const articlesResponse = await apiClient.articles.getAll(articlesParams);
      const articles = articlesResponse.articles || [];
      
      // Calculate statistics from articles
      const stats: UserStatistics = {
        totalArticles: articles.length,
        totalViews: articles.reduce((sum: number, article: any) => sum + (article.views || 0), 0),
        totalLikes: articles.reduce((sum: number, article: any) => sum + (article.likes || 0), 0),
        totalComments: articles.reduce((sum: number, article: any) => sum + ((article.comments?.length) || 0), 0),
      };
      
      return stats;
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      // Return empty statistics object as fallback
      return {
        totalArticles: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0
      };
    }
  },

  async verifyEmail(): Promise<{ message: string }> {
    try {
      const response = await apiClient.post('/users/verify-email', {});
      return response;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }
}; 