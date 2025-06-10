import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useNotifications } from '../../lib/contexts/NotificationContext';
import { Button } from './button';
import { cn } from '../../lib/utils';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, fetchNotifications, markAllAsRead } = useNotifications();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Fetch latest notifications when opening dropdown
      fetchNotifications(true);
    }
  };
  
  const closeDropdown = () => setIsOpen(false);

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
    closeDropdown();
  };
  
  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropdown from closing
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notification-dropdown')) {
        closeDropdown();
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="notification-dropdown relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={toggleDropdown}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="notification-dropdown-content absolute right-0 mt-2 w-80 max-h-[70vh] overflow-y-auto rounded-lg bg-background shadow-lg ring-1 ring-black ring-opacity-5 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Notifications</h3>
              {notifications.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleMarkAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No new notifications
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <Link
                    key={notification._id}
                    to={notification.link || '#'}
                    onClick={() => handleNotificationClick(notification._id)}
                    className={cn(
                      "block p-4 hover:bg-muted transition-colors",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {notification.by && notification.by.avatar && (
                        <div className="flex-shrink-0">
                          <img
                            src={notification.by.avatar}
                            alt={notification.by.username}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {notification.message}
                        </p>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          {notification.by && (
                            <span className="font-medium mr-2">
                              {notification.by.name || notification.by.username}
                            </span>
                          )}
                          <span>
                            {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 