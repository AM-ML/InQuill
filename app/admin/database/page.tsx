"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Switch } from "../../components/ui/switch"
import { Label } from "../../components/ui/label"
import { Separator } from "../../components/ui/separator"
import { Progress } from "../../components/ui/progress"
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Save,
  Shield,
  Activity,
  HardDrive,
  Server,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../components/ui/dropdown-menu"
import { useAdmin } from "../../components/admin/admin-context"
import { useToast } from "../../hooks/use-toastv2"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"

export default function DatabasePage() {
  const { toast } = useToast()
  const { state, fetchDatabaseStats, checkAdminAccess } = useAdmin()
  const [sqlQuery, setSqlQuery] = useState("")
  const [hasAdminAccess, setHasAdminAccess] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Fetch database stats on component mount
  useEffect(() => {
    fetchDatabaseStats().catch((err: Error) => {
      console.error("Error fetching database stats:", err)
      toast({
        title: "Error loading database statistics",
        description: "Please try refreshing the page",
        variant: "destructive"
      })
    })
    setHasAdminAccess(checkAdminAccess())
  }, [fetchDatabaseStats, toast, checkAdminAccess])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchDatabaseStats()
      toast({
        title: "Success",
        description: "Database statistics refreshed",
      })
    } catch (error) {
      console.error("Error refreshing database stats:", error)
      toast({
        title: "Error refreshing database statistics",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const databaseTables = [
    {
      name: "users",
      rows: 2847,
      size: "12.5 MB",
      lastModified: "2024-12-06 14:30:00",
    },
    {
      name: "articles",
      rows: 1234,
      size: "45.2 MB",
      lastModified: "2024-12-06 13:45:00",
    },
    {
      name: "newsletters",
      rows: 156,
      size: "2.1 MB",
      lastModified: "2024-12-05 16:20:00",
    },
    {
      name: "subscribers",
      rows: 8921,
      size: "3.8 MB",
      lastModified: "2024-12-06 12:15:00",
    },
    {
      name: "comments",
      rows: 5432,
      size: "8.9 MB",
      lastModified: "2024-12-06 11:30:00",
    },
  ]

  const backups = [
    {
      id: 1,
      filename: "backup_2024_12_06.sql",
      size: "45.2 MB",
      date: "2024-12-06 02:00:00",
      type: "Automatic",
    },
    {
      id: 2,
      filename: "backup_2024_12_05.sql",
      size: "44.8 MB",
      date: "2024-12-05 02:00:00",
      type: "Automatic",
    },
    {
      id: 3,
      filename: "manual_backup_2024_12_04.sql",
      size: "44.1 MB",
      date: "2024-12-04 15:30:00",
      type: "Manual",
    },
  ]

  // Mock data for sections where we don't have complete API data
  // In a real implementation, all of this would come from the API
  const serverMetrics = {
    cpuUsage: 23,
    memoryUsage: 42,
    diskUsage: 68,
    networkUsage: 35,
    uptime: "27 days, 4 hours",
    version: "PostgreSQL 14.5",
    location: "US East (N. Virginia)",
    lastRestart: "2024-11-09 02:00:00 UTC"
  }

  const backupData = {
    lastBackup: state.databaseTables.length > 0 ? "2024-12-06 02:00:00" : "N/A",
    backupSize: state.databaseTables.length > 0 ? "45.2 MB" : "N/A",
    backupFrequency: "Daily",
    backupRetention: "30 days",
    backupLocations: ["Primary", "DR Site"],
    nextScheduled: "2024-12-07 02:00:00 UTC"
  }
  
  // Activity data from the API response or mock data
  const weeklyActivity = [
    { day: "Monday", queries: 3100, errors: 9 },
    { day: "Tuesday", queries: 3245, errors: 12 },
    { day: "Wednesday", queries: 3050, errors: 8 },
    { day: "Thursday", queries: 2980, errors: 7 },
    { day: "Friday", queries: 2800, errors: 6 },
    { day: "Saturday", queries: 1200, errors: 2 },
    { day: "Sunday", queries: 900, errors: 1 },
  ]

  // Calculate totals from database tables data
  const totalRows = state.databaseTables.reduce((sum, table) => sum + table.rows, 0)
  
  // Function to format bytes for display
  const formatSize = (sizeString: string) => {
    return sizeString || "0 KB"
  }

  // Show loading indicator if stats are loading
  if (state.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-blue-600">Loading database statistics...</p>
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
            Database Management
          </h2>
          <p className="text-muted-foreground mt-2">Monitor and manage database performance and metrics</p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh Stats"}
        </Button>
      </motion.div>

      {/* Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-4"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{state.databaseTables.length}</div>
            <p className="text-xs text-muted-foreground">Across all schemas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rows</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRows.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All database records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Server Status</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-600 mr-2"></div>
              <div className="text-2xl font-bold">Online</div>
            </div>
            <p className="text-xs text-muted-foreground">Uptime: {serverMetrics.uptime}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backupData.lastBackup.split(' ')[0]}</div>
            <p className="text-xs text-muted-foreground">Size: {backupData.backupSize}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab} value={activeTab}>
              <div className="flex items-center justify-between">
                <CardTitle>Database Details</CardTitle>
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="tables">Tables</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="backups">Backups</TabsTrigger>
                </TabsList>
              </div>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Server Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Server Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span>CPU Usage</span>
                          <span>{serverMetrics.cpuUsage}%</span>
                        </div>
                        <Progress value={serverMetrics.cpuUsage} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span>Memory Usage</span>
                          <span>{serverMetrics.memoryUsage}%</span>
                        </div>
                        <Progress value={serverMetrics.memoryUsage} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span>Disk Usage</span>
                          <span>{serverMetrics.diskUsage}%</span>
                        </div>
                        <Progress 
                          value={serverMetrics.diskUsage} 
                          className={`h-2 ${serverMetrics.diskUsage > 80 ? "bg-red-600" : ""}`} 
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span>Network Usage</span>
                          <span>{serverMetrics.networkUsage}%</span>
                        </div>
                        <Progress value={serverMetrics.networkUsage} className="h-2" />
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Version</p>
                          <p className="font-medium">{serverMetrics.version}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Location</p>
                          <p className="font-medium">{serverMetrics.location}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Restart</p>
                          <p className="font-medium">{serverMetrics.lastRestart}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Activity Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Weekly Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[220px] flex items-end justify-between gap-2">
                        {weeklyActivity.map((day) => (
                          <div key={day.day} className="flex flex-col items-center">
                            <div className="text-xs text-muted-foreground mb-1">{day.errors > 0 ? `${day.errors} errors` : ""}</div>
                            <div 
                              className={`w-10 ${
                                day.errors > 10 ? "bg-red-500" : day.errors > 5 ? "bg-yellow-500" : "bg-blue-500"
                              } rounded-t-sm`}
                              style={{ height: `${(day.queries / 3500) * 180}px` }}
                            ></div>
                            <div className="text-xs mt-2 font-medium">{day.day.substring(0, 3)}</div>
                            <div className="text-xs text-muted-foreground">
                              {Math.round(day.queries / 100) / 10}K
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-center mt-4">
                        <p className="text-sm text-muted-foreground">Total Weekly Queries: {weeklyActivity.reduce((sum, day) => sum + day.queries, 0).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Average Daily Queries: {Math.round(weeklyActivity.reduce((sum, day) => sum + day.queries, 0) / 7).toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Tables Tab */}
              <TabsContent value="tables" className="pt-4">
                <Card>
                  <CardContent>
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Table Name</TableHead>
                            <TableHead className="text-right">Rows</TableHead>
                            <TableHead className="text-right">Size</TableHead>
                            <TableHead>Last Modified</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {state.databaseTables.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-6">
                                <div className="flex flex-col items-center justify-center">
                                  <Database className="h-8 w-8 text-gray-400 mb-2" />
                                  <p className="text-muted-foreground">No database tables found</p>
                                  <p className="text-sm text-muted-foreground">Try refreshing the statistics</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            state.databaseTables.map((table) => (
                              <TableRow key={table.name}>
                                <TableCell className="font-medium">{table.name}</TableCell>
                                <TableCell className="text-right">{table.rows.toLocaleString()}</TableCell>
                                <TableCell className="text-right">{formatSize(table.size)}</TableCell>
                                <TableCell>{table.lastModified}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="pt-4">
                <Card>
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-lg">Query Performance</h3>
                        <p className="text-muted-foreground">Performance metrics for database queries</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Detailed Analytics
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-5xl font-bold text-green-600">23ms</div>
                            <p className="text-sm mt-2">Average Query Time</p>
                            <p className="text-xs text-muted-foreground">-5% from last week</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-5xl font-bold text-yellow-600">12</div>
                            <p className="text-sm mt-2">Slow Queries ({">"}500ms)</p>
                            <p className="text-xs text-muted-foreground">+2 from last week</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-5xl font-bold">0.3%</div>
                            <p className="text-sm mt-2">Error Rate</p>
                            <p className="text-xs text-muted-foreground">No change</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="mt-8 grid grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-medium mb-4">Most Resource-Intensive Queries</h4>
                        <div className="space-y-2">
                          {['SELECT * FROM articles WHERE status = ?', 
                            'UPDATE users SET last_login = ? WHERE id = ?', 
                            'SELECT COUNT(*) FROM comments GROUP BY article_id'].map((query, i) => (
                            <div key={i} className="flex items-center p-3 border rounded-md">
                              <div className="mr-4 text-muted-foreground">#{i+1}</div>
                              <div className="font-mono text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                {query}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-4">Recent Issues</h4>
                        <div className="space-y-2">
                          <div className="flex items-center p-3 border rounded-md">
                            <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium">Connection Timeout</p>
                              <p className="text-xs text-muted-foreground">Today, 09:32 AM</p>
                            </div>
                          </div>
                          <div className="flex items-center p-3 border rounded-md">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium">Slow Query Detected</p>
                              <p className="text-xs text-muted-foreground">Yesterday, 3:17 PM</p>
                            </div>
                          </div>
                          <div className="flex items-center p-3 border rounded-md">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium">Optimization Complete</p>
                              <p className="text-xs text-muted-foreground">Dec 5, 10:22 AM</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Backups Tab */}
              <TabsContent value="backups" className="pt-4">
                <Card>
                  <CardContent className="space-y-6 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-lg">Database Backups</h3>
                        <p className="text-muted-foreground">Schedule, manage, and restore backups</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button>
                          <Download className="h-4 w-4 mr-2" />
                          Download Latest
                        </Button>
                        <Button variant="outline">
                          <Clock className="h-4 w-4 mr-2" />
                          Schedule Backup
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-4">Backup Configuration</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Backup Frequency:</span>
                            <span>{backupData.backupFrequency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Retention Policy:</span>
                            <span>{backupData.backupRetention}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Backup Locations:</span>
                            <span>{backupData.backupLocations.join(", ")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Next Scheduled:</span>
                            <span>{backupData.nextScheduled}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-4">Recent Backups</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 border rounded-md">
                            <div>
                              <p className="font-medium">Full Backup</p>
                              <p className="text-xs text-muted-foreground">2024-12-06 02:00:00</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm">{backupData.backupSize}</p>
                              <p className="text-xs text-green-600">Completed</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-md">
                            <div>
                              <p className="font-medium">Full Backup</p>
                              <p className="text-xs text-muted-foreground">2024-12-05 02:00:00</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm">44.8 MB</p>
                              <p className="text-xs text-green-600">Completed</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-md">
                            <div>
                              <p className="font-medium">Full Backup</p>
                              <p className="text-xs text-muted-foreground">2024-12-04 02:00:00</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm">44.3 MB</p>
                              <p className="text-xs text-green-600">Completed</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </motion.div>
    </div>
  )
}

