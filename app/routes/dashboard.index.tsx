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
import { userService } from "../lib/services/userService"
import { articleService } from "../lib/services/articleService"
import { format, formatDistanceToNow } from "date-fns"

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
  views?: number
  likes?: number
  createdAt: string
  updatedAt: string
}

interface Activity {
  _id: string
  user: {
    username: string
    avatar?: string
  }
  action: string
  article: {
    _id: string
    title: string
  }
  createdAt: string
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
        
        // Get user statistics
        const userStats = await userService.getUserStatistics();
        setStats(userStats);
        
        // Get recent articles
        const articlesResponse = await articleService.getArticles({
          limit: 5,
          sort: "newest"
        });
        setRecentArticles(articlesResponse.articles || []);
        
        // Get recent activities (would need a real API endpoint)
        try {
          const activitiesResponse = await apiClient.get('/activities/recent');
          setActivities(activitiesResponse.activities || []);
        } catch (error) {
          console.error("Error fetching activities:", error);
          // If the activities endpoint is not available, use empty array
          setActivities([]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Set default values on error
        setStats({
          totalArticles: 0,
          totalViews: 0,
          totalLikes: 0,
          totalComments: 0
        });
        setRecentArticles([]);
        setActivities([]);
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
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "";
    }
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
      change: "",
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Total Views",
      value: formatNumber(stats?.totalViews || 0),
      change: "",
      icon: Eye,
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Likes",
      value: formatNumber(stats?.totalLikes || 0),
      change: "",
      icon: Heart,
      color: "text-red-600 dark:text-red-400",
    },
    {
      title: "Comments",
      value: formatNumber(stats?.totalComments || 0),
      change: "",
      icon: MessageCircle,
      color: "text-purple-600 dark:text-purple-400",
    },
  ]

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || user?.username || "Researcher"}</h1>
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
                {stat.change && <p className="text-xs text-muted-foreground">{stat.change}</p>}
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
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Articles</CardTitle>
                <CardDescription>Your latest published and draft articles</CardDescription>
              </div>
              <Link to="/dashboard/articles">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentArticles.length > 0 ? (
                recentArticles.map((article) => (
                  <Link to={`/dashboard/write?id=${article._id}`} key={article._id} className="block">
                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{article.title}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge variant={article.status === "published" ? "default" : "secondary"}>
                            {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{formatDate(article.updatedAt || article.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        {article.status === "published" && (
                          <>
                            <div className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{formatNumber(article.views || 0)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="h-3 w-3" />
                              <span>{formatNumber(article.likes || 0)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No articles yet</p>
                  <Link to="/dashboard/write" className="mt-2 inline-block">
                    <Button variant="outline" size="sm" className="mt-2">
                      Write your first article
                    </Button>
                  </Link>
                </div>
              )}
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
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest interactions with your articles</CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity._id} className="flex items-start space-x-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.username} />
                        <AvatarFallback>{activity.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user.username}</span>{' '}
                          {activity.action}{' '}
                          <Link to={`/articles/${activity.article._id}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                            {activity.article.title}
                          </Link>
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(activity.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No activity yet</p>
                  <p className="text-xs mt-1">Activity will appear when people interact with your articles</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 