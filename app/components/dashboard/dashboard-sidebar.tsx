"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { Home, User, Settings, FileText, PenTool, Bell, LogOut, ChevronRight } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar
} from "../ui/sidebar"
import { Logo } from "../ui/logo"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { useAuth } from "../../lib/contexts/AuthContext"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

export function DashboardSidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { isExpanded } = useSidebar()

  const navigationItems = [
    {
      title: "Home",
      icon: Home,
      href: "/",
      description: "Back to main site",
    },
    {
      title: "Dashboard",
      icon: FileText,
      href: "/dashboard",
      description: "Your dashboard",
    },
    {
      title: "Profile",
      icon: User,
      href: "/dashboard/profile",
      description: "Manage your profile",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      description: "Account settings",
    },
    {
      title: "My Articles",
      icon: FileText,
      href: "/dashboard/articles",
      description: "Your published articles",
      badge: "12",
    },
    {
      title: "Write Article",
      icon: PenTool,
      href: "/dashboard/write",
      description: "Create new article",
    },
  ]

  const handleSignOut = () => {
    logout();
  }

  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-800 h-min">
      

      <SidebarContent className={`${isExpanded ? 'px-4' : 'px-2'}`} style={{ marginTop: "1rem" }}>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item, index) => (
                <TooltipProvider key={item.title} disableHoverableContent>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <SidebarMenuItem className="list-none">
                          <Link to={item.href} className="w-full">
                            <SidebarMenuButton 
                              className="w-full justify-start"
                            >
                              {isExpanded ? (
                                <div className="flex items-center space-x-3 p-3 rounded-lg w-full">
                                  <item.icon className="h-5 w-5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">{item.title}</span>
                                      {item.badge && (
                                        <Badge variant="secondary" className="ml-2 text-xs">
                                          {item.badge}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center p-3 rounded-lg w-full">
                                  <div className="relative">
                                    <item.icon className="h-5 w-5" />
                                    {item.badge && (
                                      <Badge variant="secondary" className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                                        {item.badge}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuItem>
                      </motion.div>
                    </TooltipTrigger>
                    {!isExpanded && (
                      <TooltipContent side="right">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className={`space-y-2 ${!isExpanded && 'flex flex-col items-center'}`}>
              
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={`p-4 ${!isExpanded && 'flex justify-center'}`}>
        {isExpanded ? (
          <Collapsible open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-3">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src={user?.avatar || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"} alt="User" />
                  <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">
                    {user?.username || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
                <ChevronRight className={`h-4 w-4 transition-transform ${isProfileOpen ? "rotate-90" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-2">
              <Link to="/dashboard/profile" className="block w-full">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </Link>
              <Link to="/dashboard/settings" className="block w-full">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-red-600 dark:text-red-400"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"} alt="User" />
                    <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-medium">{user?.username || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </SidebarFooter>
    </Sidebar>
  )
} 