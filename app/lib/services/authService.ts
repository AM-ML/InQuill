import { API_URL } from '../constants';
import type { UserRole } from '../constants';
import { setAuthToken } from '../utils/authUtils';
import { apiClient } from '../utils/apiClient';

interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthResponse {
  user: User;
  message?: string;
  token?: string;
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

export const authService = {
  async login(email: string, password: string, rememberMe: boolean = false): Promise<AuthResponse> {
    try {
      const data = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password,
        rememberMe
      });
      
      // Store token in cookie if provided
      if (data.token) {
        setAuthToken(data.token, rememberMe);
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const data = await apiClient.post<AuthResponse>('/auth/register', {
        username,
        email,
        password
      });
      
      // Store token in cookie if provided
      if (data.token) {
        setAuthToken(data.token, true); // Default to remember me for registration
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout request failed, clearing local auth state anyway', error);
    } finally {
      // Always clear the token regardless of server response
      setAuthToken(null);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const data = await apiClient.get<{ user: User }>('/auth/me');
      return data.user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      
      // Clear token if unauthorized
      if (error && (error as any).status === 401) {
        setAuthToken(null);
      }
      
      return null;
    }
  },
  
  // Debug function to test authentication
  async testAuth(): Promise<any> {
    try {
      return await apiClient.get('/auth/test');
    } catch (error) {
      console.error('Auth test failed:', error);
      throw error;
    }
  }
}; 