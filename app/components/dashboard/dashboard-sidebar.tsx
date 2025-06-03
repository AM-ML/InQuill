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
} from "../ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { useAuth } from "../../lib/contexts/AuthContext"

export function DashboardSidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

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
      <SidebarHeader className="p-6">
        <Link to="/" className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg w-10 h-10 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 rounded-md w-6 h-6"></div>
          </div>
          <div>
            <h2 className="font-bold text-lg">MedResearch</h2>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <SidebarMenuItem className="list-none">
                    <Link to={item.href} className="w-full">
                      <SidebarMenuButton 
                        className="w-full justify-start"
                      >
                        <div className="flex items-center space-x-3 p-3 rounded-lg w-full">
                          <item.icon className="h-5 w-5" />
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
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                </motion.div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2">
              <Link to="/dashboard/write" className="w-full block">
                <Button variant="outline" size="sm" className="py-6 w-full justify-start">
                  <PenTool className="h-4 w-4 mr-2" />
                  New Article
                </Button>
              </Link>
              <Link to="/dashboard/articles" className="w-full block">
                <Button variant="outline" size="sm" className="py-6 w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  My Articles
                  <Badge variant="destructive" className="ml-auto text-xs">
                    3
                  </Badge>
                </Button>
              </Link>
              <Link to="/dashboard" className="w-full block">
                <Button variant="outline" size="sm" className="py-6 w-full justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                  <Badge variant="destructive" className="ml-auto text-xs ">
                    3
                  </Badge>
                </Button>
              </Link>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Collapsible open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-3">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt="User" />
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
      </SidebarFooter>
    </Sidebar>
  )
} 