"use client"

import { Bell, Search, Trash2, Check } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ModeToggle } from "../mode-toggle"
import { SidebarTrigger } from "../ui/sidebar"
import { Badge } from "../ui/badge"
import { format, formatDistanceToNow } from "date-fns"
import { useNotifications } from "../../lib/contexts/NotificationContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuFooter,
} from "../ui/dropdown-menu"
import { Spinner } from "../ui/spinner"
import { useEffect, useState } from "react"

export function DashboardHeader() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    fetchNotifications,
  } = useNotifications();

  // Refresh notifications when component mounts
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div className="relative w-64 lg:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search articles, authors, topics..." className="pl-9" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs text-center text-white mx-auto">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => markAllAsRead()}>
                    <Check className="h-3 w-3 mr-1" />
                    Mark all as read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center py-4">
                    <Spinner className="h-5 w-5" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No notifications</p>
                  </div>
                ) : (
                  <DropdownMenuGroup>
                    {notifications.map((notification) => (
                      <DropdownMenuItem key={notification._id} className="p-0">
                        <div 
                          className={`w-full px-3 py-2 flex flex-col space-y-1 cursor-pointer border-l-2 ${
                            notification.read 
                              ? 'border-transparent' 
                              : 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                          }`}
                          onClick={() => !notification.read && markAsRead(notification._id)}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <div className="flex items-center">
                              <span className="text-xs text-muted-foreground mr-2">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-5 w-5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification._id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                )}
              </div>
              
              {notifications.length > 0 && (
                <DropdownMenuFooter className="flex justify-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={() => clearAll()}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear All
                  </Button>
                </DropdownMenuFooter>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
} 