"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Progress } from "../components/ui/progress"
import {
  Users,
  FileText,
  BarChart3,
  Mail,
  Search,
  TrendingUp,
  Eye,
  Shield,
  ShieldCheck,
  Trash2,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Plus,
  Send,
  Download,
  RefreshCw,
  Database,
  ArrowUpDown,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { useAdmin } from "../components/admin/admin-context"
import { useToast } from "../hooks/use-toastv2"
import {Link} from "react-router-dom"

export default function AdminPanel() {
  const { toast } = useToast()
  const { 
    state, 
    fetchUsers, 
    fetchArticles, 
    fetchNewsletters, 
    fetchDatabaseStats,
    fetchDashboardStats,
    approveArticle,
    rejectArticle
  } = useAdmin()

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchDashboardStats(),
          fetchUsers(),
          fetchArticles(),
          fetchNewsletters(),
          fetchDatabaseStats()
        ])
      } catch (error) {
        console.error("Error fetching admin data:", error)
        toast({
          title: "Error loading dashboard data",
          description: "Please try refreshing the page",
          variant: "destructive"
        })
      }
    }
    
    fetchAllData()
  }, [fetchUsers, fetchArticles, fetchNewsletters, fetchDatabaseStats, fetchDashboardStats, toast])

  // Use real-time data from the dashboard stats
  const dashboardStats = state.dashboardStats || {}
  const userStats = dashboardStats.users || {}
  const articleStats = dashboardStats.articles || {}
  const viewStats = dashboardStats.views || {}
  const newsletterStats = dashboardStats.newsletter || {}
  const contentDistribution = dashboardStats.contentDistribution || []
  const weeklyActivity = dashboardStats.weeklyActivity || []
  
  // Extract specific article stats
  const publishedArticlesCount = articleStats.statusCounts?.published || 0
  const pendingArticlesCount = articleStats.statusCounts?.pending || 0
  const totalArticlesCount = articleStats.total || 0
  const avgWordCount = 1200 // Mock data since we don't track word count
  
  // Show loading indicator if data is loading
  if (state.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-blue-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h2>
          <p className="text-muted-foreground mt-2">Overview and analytics for your platform</p>
        </div>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-4"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.total || 0}</div>
            <p className="text-xs text-muted-foreground">+{userStats.growthRate || 0}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedArticlesCount}</div>
            <p className="text-xs text-muted-foreground">+{articleStats.growthRate || 0}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{viewStats.thisWeek || 0}</div>
            <p className="text-xs text-muted-foreground">+{viewStats.growthRate || 0}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletter Subscribers</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newsletterStats.subscribers || 0}</div>
            <p className="text-xs text-muted-foreground">+{newsletterStats.growthRate || 0}% from last month</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userStats.active || userStats.total || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(((userStats.active || userStats.total) / userStats.total) * 100) || 100}% of total users
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Articles</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingArticlesCount}</div>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Word Count</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {avgWordCount.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">Per article</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Newsletter Open Rate</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68.5%</div>
                  <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts and Graphs */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-2 md:col-span-1">
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                  <CardDescription>User engagement over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-end justify-between gap-2">
                    {weeklyActivity.map((activity, i) => {
                      // Calculate height based on active users (normalized to fit the chart)
                      const maxHeight = 150; // Maximum height in pixels
                      const maxUsers = Math.max(...weeklyActivity.map(a => a.activeUsers || 0));
                      const height = maxUsers > 0 
                        ? Math.max(30, (activity.activeUsers / maxUsers) * maxHeight)
                        : 30 + Math.random() * 40; // Fallback if no data
                      
                      return (
                        <div key={i} className="flex flex-col items-center">
                          <div 
                            className="bg-blue-500 dark:bg-blue-600 rounded-t w-10"
                            style={{ height: `${height}px` }}
                          ></div>
                          <div className="text-xs mt-2">{activity.day}</div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-2 md:col-span-1">
                <CardHeader>
                  <CardTitle>Content Distribution</CardTitle>
                  <CardDescription>Articles by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contentDistribution.map((category, i) => {
                      return (
                        <div key={category.category} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="text-sm">{category.category}</div>
                            <div className="text-sm text-muted-foreground">{category.percentage}%</div>
                          </div>
                          <Progress value={category.percentage} />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest user registrations</CardDescription>
                </div>
                <Link to="/admin/users">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.users.slice(0, 5).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.role === "Admin"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : user.role === "Editor"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.status === "Active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.registrationDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Users by role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(userStats.roleBreakdown || {}).map(([role, count]) => {
                    const percentage = userStats.total > 0 
                      ? Math.round((Number(count) / userStats.total) * 100) 
                      : 0
                    
                    return (
                      <div key={role} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm">{role.charAt(0).toUpperCase() + role.slice(1)}</div>
                          <div className="text-sm text-muted-foreground">{count} users ({percentage}%)</div>
                        </div>
                        <Progress value={percentage} />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Articles</CardTitle>
                  <CardDescription>Latest content submissions</CardDescription>
                </div>
                  <Link to="/admin/articles">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.articles.slice(0, 5).map((article) => (
                      <TableRow key={article.id}>
                        <TableCell>
                          <div className="font-medium">{article.title}</div>
                        </TableCell>
                        <TableCell>{article.author}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              article.status === "Published"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : article.status === "Pending" || article.status === "Under Review"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : article.status === "Rejected"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                            }
                          >
                            {article.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{article.category}</TableCell>
                        <TableCell className="text-right">
                          {article.status === "Pending" || article.status === "Under Review" ? (
                            <div className="flex items-center justify-end space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => approveArticle(article.id)}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => rejectArticle(article.id)}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Content Status</CardTitle>
                  <CardDescription>Articles by status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Published", "Pending", "Draft", "Rejected", "Under Review"].map((status) => {
                      const count = state.articles.filter((a) => a.status === status).length
                      const percentage = state.articles.length > 0 ? Math.round((count / state.articles.length) * 100) : 0
                      
                      return (
                        <div key={status} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="text-sm">{status}</div>
                            <div className="text-sm text-muted-foreground">{count} articles ({percentage}%)</div>
                          </div>
                          <Progress value={percentage} />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Articles</CardTitle>
                  <CardDescription>By view count</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {state.articles
                      .filter(a => a.status === "Published")
                      .sort((a, b) => b.views - a.views)
                      .slice(0, 5)
                      .map((article, i) => (
                        <div key={article.id} className="flex items-center">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold mr-3">
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{article.title}</p>
                            <p className="text-xs text-muted-foreground">{article.views.toLocaleString()} views</p>
                          </div>
                        </div>
                      ))}
                    
                    {state.articles.filter(a => a.status === "Published").length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        No published articles yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions across the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {dashboardStats.recentActivity?.length > 0 ? (
                  dashboardStats.recentActivity.map((activity, i) => (
                    <div key={activity._id} className="flex items-start">
                      {activity.by && activity.by.avatar ? (
                        <Avatar className="h-9 w-9 mr-3">
                          <AvatarImage src={activity.by.avatar} alt={activity.by.username || 'User'} />
                          <AvatarFallback>{(activity.by.username || 'U')[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center mr-3">
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.by ? (activity.by.name || activity.by.username) : 'System'} • {' '}
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

