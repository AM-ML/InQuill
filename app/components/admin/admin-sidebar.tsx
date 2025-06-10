"use client"

import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { BarChart3, Users, FileText, Mail, Shield, Bell, Database, Zap, Home, LogOut } from "lucide-react"
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
import { useAdmin } from "./admin-context"

export function AdminSidebar() {
  const pathname = useLocation().pathname
  const { state } = useAdmin()

  const navigationItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      href: "/admin",
      description: "Overview & Analytics",
    },
    {
      title: "User Management",
      icon: Users,
      href: "/admin/users",
      description: "Manage users & roles",
      badge: state.users.length.toString(),
    },
    {
      title: "Content Moderation",
      icon: FileText,
      href: "/admin/articles",
      description: "Review articles",
      badge: state.articles.filter((a) => a.status === "Pending").length.toString(),
    },
    {
      title: "Newsletter",
      icon: Mail,
      href: "/admin/newsletter",
      description: "Email campaigns",
      badge: state.newsletters.filter((n) => n.status === "Draft").length.toString(),
    },
    {
      title: "Database",
      icon: Database,
      href: "/admin/database",
      description: "Data management",
    },
  ]

  const quickActions = [
    {
      title: "Security Alerts",
      icon: Shield,
      badge: "3",
      color: "text-red-500",
    },
    {
      title: "Notifications",
      icon: Bell,
      badge: "12",
      color: "text-blue-500",
    },
    {
      title: "Performance",
      icon: Zap,
      badge: "Good",
      color: "text-green-500",
    },
  ]

  return (
    <Sidebar className="border-r border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
      <SidebarHeader className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
        <Link to="/admin" className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl w-12 h-12 flex items-center justify-center shadow-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Admin Panel
            </h2>
            <p className="text-xs text-muted-foreground">Control Center</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <SidebarMenuItem className="list-none">
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      className="w-full justify-start hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/50 dark:hover:to-indigo-950/50 transition-all duration-200"
                    >
                      <Link to={item.href} className="flex items-center space-x-3 p-3 rounded-xl">
                        <div
                          className={`p-2 rounded-lg ${
                            pathname === item.href
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                              : "bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50"
                          }`}
                        >
                          <item.icon
                            className={`h-4 w-4 ${
                              pathname === item.href ? "text-white" : "text-blue-600 dark:text-blue-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-medium text-sm ${
                                pathname === item.href ? "text-blue-600 dark:text-blue-400" : ""
                              }`}
                            >
                              {item.title}
                            </span>
                            {item.badge && Number.parseInt(item.badge) > 0 && (
                              <Badge
                                variant="secondary"
                                className="ml-2 text-xs bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </motion.div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start p-3 h-auto hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-900/50 dark:hover:to-gray-800/50"
                  >
                    <action.icon className={`h-4 w-4 mr-3 ${action.color}`} />
                    <span className="flex-1 text-left text-sm">{action.title}</span>
                    <Badge variant={action.badge === "Good" ? "default" : "destructive"} className="text-xs">
                      {action.badge}
                    </Badge>
                  </Button>
                </motion.div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupContent>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Website
              </Link>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User Avatar" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{state.currentUserEmail || "admin@example.com"}</p>
            <p className="text-xs text-muted-foreground">{state.currentUserRole || "Admin"}</p>
          </div>
          <Button variant="ghost" size="icon">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

