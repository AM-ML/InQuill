"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { FileText, PenTool, Eye, Heart, MessageCircle, Users, BookOpen } from "lucide-react"
import { useAuth } from "../lib/contexts/AuthContext"
import { apiClient } from "../lib/utils/apiClient"

interface Stats {
  totalArticles: number
  totalViews: number
  totalLikes: number
  totalComments: number
}

interface Article {
  _id: string
  title: string
  status: string
  views: number
  likes: number
  date: string
}

interface Activity {
  _id: string
  user: string
  userAvatar?: string
  action: string
  article: string
  time: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentArticles, setRecentArticles] = useState<Article[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // In a real implementation, these would be actual API calls
        // For now, we'll use mock data that could be replaced with real endpoints later
        
        // Example API call: const response = await apiClient.get('/api/dashboard/stats')
        
        // Mock stats data
        setStats({
          totalArticles: 12,
          totalViews: 24500,
          totalLikes: 1200,
          totalComments: 342
        })
        
        // Mock recent articles
        setRecentArticles([
          {
            _id: "1",
            title: "AI-Powered Diagnostic Tools in Modern Medicine",
            status: "Published",
            views: 2100,
            likes: 89,
            date: "2 days ago"
          },
          {
            _id: "2",
            title: "The Future of Personalized Medicine",
            status: "Draft",
            views: 0,
            likes: 0,
            date: "1 week ago"
          },
          {
            _id: "3",
            title: "Breakthrough in Cancer Immunotherapy",
            status: "Published",
            views: 3400,
            likes: 156,
            date: "2 weeks ago"
          }
        ])
        
        // Mock activities
        setActivities([
          {
            _id: "1",
            user: "Dr. Michael Rodriguez",
            action: "liked your article",
            article: "AI-Powered Diagnostic Tools",
            time: "2 hours ago"
          },
          {
            _id: "2",
            user: "Dr. Emily Johnson",
            action: "commented on",
            article: "The Future of Personalized Medicine",
            time: "4 hours ago"
          },
          {
            _id: "3",
            user: "Dr. James Wilson",
            action: "shared your article",
            article: "Breakthrough in Cancer Immunotherapy",
            time: "1 day ago"
          }
        ])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Format numbers with proper suffixes (e.g. 1.2K)
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  // Display a loading state while fetching data
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Define stats cards based on fetched data
  const statCards = [
    {
      title: "Total Articles",
      value: formatNumber(stats?.totalArticles || 0),
      change: "+2 this month",
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Views",
      value: formatNumber(stats?.totalViews || 0),
      change: "+12% from last month",
      icon: Eye,
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Likes",
      value: formatNumber(stats?.totalLikes || 0),
      change: "+8% from last month",
      icon: Heart,
      color: "text-red-600 dark:text-red-400",
    },
    {
      title: "Comments",
      value: formatNumber(stats?.totalComments || 0),
      change: "+15% from last month",
      icon: MessageCircle,
      color: "text-purple-600 dark:text-purple-400",
    },
  ]

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.username || "Researcher"}</h1>
            <p className="text-muted-foreground">Here's what's happening with your research articles today.</p>
          </div>
          <Link to="/dashboard/write">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500">
              <PenTool className="h-4 w-4 mr-2" />
              Write New Article
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Articles</CardTitle>
              <CardDescription>Your latest published and draft articles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentArticles.map((article) => (
                <div key={article._id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{article.title}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <Badge variant={article.status === "Published" ? "default" : "secondary"}>{article.status}</Badge>
                      <span className="text-xs text-muted-foreground">{article.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    {article.status === "Published" && (
                      <>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{formatNumber(article.views)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{formatNumber(article.likes)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
              <Link to="/dashboard/articles" className="block w-full">
                <Button variant="outline" className="w-full">
                  View All Articles
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/dashboard/write" className="block w-full">
                <Button variant="outline" className="w-full justify-start">
                  <PenTool className="h-4 w-4 mr-2" />
                  Write New Article
                </Button>
              </Link>
              <Link to="/dashboard/articles" className="block w-full">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Manage Articles
                </Button>
              </Link>
              <Link to="/dashboard/profile" className="block w-full">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
              </Link>
              <Link to="/articles" className="block w-full">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Research
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest interactions with your content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity._id} className="flex items-center space-x-3 p-3 rounded-lg border">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.userAvatar || "/placeholder.svg"} alt={activity.user} />
                    <AvatarFallback>
                      {activity.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>{" "}
                      <span className="font-medium">"{activity.article}"</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 