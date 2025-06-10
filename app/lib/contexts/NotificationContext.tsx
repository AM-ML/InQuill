import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { notificationService } from '../services/notificationService';
import type { Notification } from '../services/notificationService';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: (force?: boolean) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const defaultNotificationContext: NotificationContextType = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  fetchNotifications: async () => { throw new Error('NotificationContext not initialized'); },
  markAsRead: async () => { throw new Error('NotificationContext not initialized'); },
  markAllAsRead: async () => { throw new Error('NotificationContext not initialized'); },
};

const NotificationContext = createContext<NotificationContextType>(defaultNotificationContext);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Last fetch timestamp to prevent excessive fetching
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const FETCH_COOLDOWN_MS = 10000; // 10 seconds cooldown
  const initialFetchDone = useRef(false);

  const fetchNotifications = useCallback(async (force = false) => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    // Don't fetch if we recently fetched, unless forced
    const now = Date.now();
    if (!force && now - lastFetchTime < FETCH_COOLDOWN_MS) {
      return;
    }

    try {
      setLoading(true);
      const fetchedNotifications = await notificationService.getNotifications();
      setNotifications(fetchedNotifications);
      setUnreadCount(fetchedNotifications.length);
      setError(null);
      setLastFetchTime(now);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [user, lastFetchTime]);

  const markAsRead = async (notificationId: string) => {
    try {
      const updatedNotification = await notificationService.markAsRead(notificationId);
      
      // Update the notifications list
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => 
          notification._id !== notificationId
        )
      );
      
      // Update unread count
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all notifications as read');
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Fetch notifications once when the user logs in or on initial load
  useEffect(() => {
    if (user && !initialFetchDone.current) {
      fetchNotifications(true);
      initialFetchDone.current = true;
    } else if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      initialFetchDone.current = false;
    }
  }, [user, fetchNotifications]);

  // Set up periodic refresh (every 60 seconds - less frequent)
  useEffect(() => {
    if (!user) return;

    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 60000); // 60 seconds

    return () => clearInterval(intervalId);
  }, [user, fetchNotifications]);

  // Add event listener for visibility changes
  useEffect(() => {
    if (!user) return;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchNotifications(true);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
} 