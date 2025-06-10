"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Separator } from "../../components/ui/separator"
import {
  Mail,
  Send,
  Plus,
  CalendarDays,
  UserPlus,
  UserMinus,
  BarChart3,
  CheckCircle,
  Eye,
  Calendar,
  Users
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog"
import { useAdmin } from "../../components/admin/admin-context"
import { useToast } from "../../hooks/use-toastv2"
import { Editor } from "../../components/ui/editor"

export default function NewsletterPage() {
  const { toast } = useToast()
  const { state, fetchNewsletters, sendNewsletter, createNewsletter } = useAdmin()
  const [activeTab, setActiveTab] = useState("compose")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [subscriberStats, setSubscriberStats] = useState({
    total: 8921,
    active: 8456,
    unsubscribed: 465,
    growth: "+6.7%"
  })
  
  // Mock subscriber data - In a real app, this would come from API
  const subscribers = [
    {
      id: 1,
      email: "john.doe@example.com",
      name: "John Doe",
      subscribeDate: "2024-01-15",
      status: "Active",
      source: "Website",
    },
    {
      id: 2,
      email: "jane.smith@example.com",
      name: "Jane Smith",
      subscribeDate: "2024-02-20",
      status: "Active",
      source: "Social Media",
    },
    {
      id: 3,
      email: "bob.johnson@example.com",
      name: "Bob Johnson",
      subscribeDate: "2024-03-10",
      status: "Unsubscribed",
      source: "Referral",
    },
    {
      id: 4,
      email: "alice.williams@example.com",
      name: "Alice Williams",
      subscribeDate: "2024-04-05",
      status: "Active",
      source: "Website",
    },
    {
      id: 5,
      email: "michael.brown@example.com",
      name: "Michael Brown",
      subscribeDate: "2024-05-12",
      status: "Active",
      source: "Newsletter Signup",
    },
  ]

  // Fetch newsletters on component mount
  useEffect(() => {
    fetchNewsletters().catch(err => {
      console.error("Error fetching newsletters:", err)
      toast({
        title: "Error loading newsletters",
        description: "Please try refreshing the page",
        variant: "destructive"
      })
    })
  }, [fetchNewsletters, toast])

  const handleSaveDraft = async () => {
    if (!subject.trim()) {
      toast({
        title: "Error",
        description: "Newsletter subject is required",
        variant: "destructive"
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Newsletter content is required",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSaving(true)
      await createNewsletter(subject, content)
      
      // Clear the form
      setSubject("")
      setContent("")
      
      toast({
        title: "Success",
        description: "Newsletter draft saved successfully",
      })
      
      // Switch to the all newsletters tab
      setActiveTab("all")
    } catch (error) {
      console.error("Error saving newsletter draft:", error)
      toast({
        title: "Error",
        description: "Failed to save newsletter draft. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSendNewsletter = async (newsletterId: number) => {
    try {
      setIsSending(true)
      await sendNewsletter(newsletterId)
      toast({
        title: "Success",
        description: "Newsletter sent successfully",
      })
    } catch (error) {
      console.error("Error sending newsletter:", error)
      toast({
        title: "Error",
        description: "Failed to send newsletter. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSending(false)
    }
  }

  // Show loading indicator if newsletters are loading
  if (state.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-blue-600">Loading newsletter data...</p>
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
            Newsletter Management
          </h2>
          <p className="text-muted-foreground mt-2">Create, schedule, and track newsletter campaigns</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setActiveTab("compose")}>
            <Plus className="h-4 w-4 mr-2" />
            New Newsletter
          </Button>
        </div>
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
            <CardTitle className="text-sm font-medium">Total Newsletters</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{state.newsletters.length}</div>
            <p className="text-xs text-muted-foreground">+{Math.floor(state.newsletters.length * 0.1)} from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriberStats.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{subscriberStats.growth} growth rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.9%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {state.newsletters.find(n => n.status === "Draft") ? (
              <>
                <div className="text-2xl font-bold">Draft Ready</div>
                <p className="text-xs text-muted-foreground">Ready to send</p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">None</div>
                <p className="text-xs text-muted-foreground">No scheduled newsletters</p>
              </>
            )}
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
            <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab} value={activeTab}>
              <div className="flex items-center justify-between">
                <CardTitle>Email Campaigns</CardTitle>
                <TabsList>
                  <TabsTrigger value="compose">Compose</TabsTrigger>
                  <TabsTrigger value="all">All Newsletters</TabsTrigger>
                  <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
              </div>
              
              {/* Compose Tab */}
              <TabsContent value="compose" className="pt-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">Newsletter Subject</label>
                    <Input 
                      id="subject" 
                      placeholder="Enter newsletter subject line..." 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium mb-2">Email Content</label>
                    <div className="min-h-[400px] border rounded-md overflow-hidden">
                      <Suspense fallback={<div>Loading editor...</div>}>
                        <Editor 
                          value={content} 
                          onChange={setContent} 
                          placeholder="Compose your newsletter content here..."
                        />
                      </Suspense>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => {
                      setSubject("")
                      setContent("")
                    }}>
                      Clear
                    </Button>
                    <Button 
                      variant="outline" 
                      disabled={!subject.trim() || !content.trim() || isSaving}
                      onClick={handleSaveDraft}
                    >
                      {isSaving ? "Saving..." : "Save as Draft"}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          disabled={!subject.trim() || !content.trim() || isSending}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {isSending ? "Sending..." : "Send Newsletter"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Send Newsletter</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to send this newsletter to all {subscriberStats.active.toLocaleString()} active subscribers? 
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              try {
                                setIsSending(true)
                                const newNewsletter = await createNewsletter(subject, content)
                                if (newNewsletter && typeof newNewsletter === 'object' && 'id' in newNewsletter) {
                                  await sendNewsletter(newNewsletter.id as number)
                                  setSubject("")
                                  setContent("")
                                  setActiveTab("all")
                                }
                                toast({
                                  title: "Success",
                                  description: "Newsletter sent successfully",
                                })
                              } catch (error) {
                                console.error("Error sending newsletter:", error)
                                toast({
                                  title: "Error",
                                  description: "Failed to send newsletter. Please try again.",
                                  variant: "destructive"
                                })
                              } finally {
                                setIsSending(false)
                              }
                            }}
                          >
                            Send to All Subscribers
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </TabsContent>
              
              {/* All Newsletters Tab */}
              <TabsContent value="all" className="pt-4">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Sent Date</TableHead>
                        <TableHead>Recipients</TableHead>
                        <TableHead>Open Rate</TableHead>
                        <TableHead>Click Rate</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {state.newsletters.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6">
                            <div className="flex flex-col items-center justify-center">
                              <Mail className="h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-muted-foreground">No newsletters found</p>
                              <p className="text-sm text-muted-foreground">Create your first newsletter</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        state.newsletters.map((newsletter) => (
                          <TableRow key={newsletter.id}>
                            <TableCell>{newsletter.subject}</TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  newsletter.status === "Sent" 
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                }
                              >
                                {newsletter.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{newsletter.sentDate || "Not sent yet"}</TableCell>
                            <TableCell>{newsletter.status === "Sent" ? newsletter.recipients.toLocaleString() : "-"}</TableCell>
                            <TableCell>{newsletter.status === "Sent" ? newsletter.openRate : "-"}</TableCell>
                            <TableCell>{newsletter.status === "Sent" ? newsletter.clickRate : "-"}</TableCell>
                            <TableCell className="text-right">
                              {newsletter.status === "Draft" ? (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" className="ml-2">
                                      <Send className="h-3 w-3 mr-1" />
                                      Send
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Send Newsletter</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to send "{newsletter.subject}" to all active subscribers?
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleSendNewsletter(newsletter.id)}
                                      >
                                        Send Newsletter
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              ) : (
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              {/* Subscribers Tab */}
              <TabsContent value="subscribers" className="pt-4">
                <div className="space-y-6">
                  {/* Subscriber Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Subscriber Stats</CardTitle>
                      <CardDescription>Newsletter subscription analytics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Total Subscribers</span>
                          <span className="font-bold">{subscriberStats.total.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Active Subscribers</span>
                          <span className="font-bold text-green-600">{subscriberStats.active.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Unsubscribed</span>
                          <span className="font-bold text-red-600">{subscriberStats.unsubscribed.toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span>Average Open Rate</span>
                          <span className="font-bold">68.9%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Average Click Rate</span>
                          <span className="font-bold">13.2%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Growth Rate</span>
                          <span className="font-bold text-green-600">{subscriberStats.growth}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Subscriber List */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Subscriber List</h3>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4 mr-2" />
                          Import Subscribers
                        </Button>
                        <Button size="sm">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Subscriber
                        </Button>
                      </div>
                    </div>
                    
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Subscribed On</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subscribers.map((subscriber) => (
                            <TableRow key={subscriber.id}>
                              <TableCell className="font-medium">{subscriber.email}</TableCell>
                              <TableCell>{subscriber.name}</TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    subscriber.status === "Active"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  }
                                >
                                  {subscriber.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{subscriber.subscribeDate}</TableCell>
                              <TableCell>{subscriber.source}</TableCell>
                              <TableCell className="text-right">
                                {subscriber.status === "Active" ? (
                                  <Button size="sm" variant="outline" className="text-red-600">
                                    <UserMinus className="h-3 w-3 mr-1" />
                                    Unsubscribe
                                  </Button>
                                ) : (
                                  <Button size="sm" variant="outline" className="text-green-600">
                                    <UserPlus className="h-3 w-3 mr-1" />
                                    Reactivate
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Analytics Tab */}
              <TabsContent value="analytics" className="pt-4">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Newsletter Performance</CardTitle>
                      <CardDescription>Analytics for sent newsletters</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {/* Performance Overview */}
                      <div className="grid grid-cols-4 gap-4">
                        <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                          <div className="text-4xl font-bold">
                            {state.newsletters.filter(n => n.status === "Sent").length}
                          </div>
                          <div className="text-sm text-muted-foreground mt-2">Newsletters Sent</div>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                          <div className="text-4xl font-bold text-blue-600">68.9%</div>
                          <div className="text-sm text-muted-foreground mt-2">Avg. Open Rate</div>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                          <div className="text-4xl font-bold text-green-600">13.2%</div>
                          <div className="text-sm text-muted-foreground mt-2">Avg. Click Rate</div>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                          <div className="text-4xl font-bold text-red-600">0.23%</div>
                          <div className="text-sm text-muted-foreground mt-2">Unsubscribe Rate</div>
                        </div>
                      </div>
                      
                      {/* Monthly Analytics */}
                      <div>
                        <h3 className="font-medium mb-4">Monthly Performance (2024)</h3>
                        <div className="h-[300px] w-full flex items-end justify-between space-x-2">
                          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, i) => {
                            // Generate some random data for the chart
                            const height = 40 + (Math.sin(i/2) * 30) + Math.random() * 20;
                            const openRate = 50 + (Math.sin(i/2) * 15) + Math.random() * 10;
                            const clickRate = openRate * (0.15 + Math.random() * 0.1);
                            
                            return (
                              <div key={month} className="flex-1 flex flex-col items-center">
                                <div className="w-full flex">
                                  <div
                                    className="bg-blue-200 dark:bg-blue-800/50 w-full rounded-t"
                                    style={{ height: `${clickRate}px` }}
                                  ></div>
                                </div>
                                <div
                                  className="bg-blue-500 dark:bg-blue-600 w-full"
                                  style={{ height: `${openRate}px` }}
                                ></div>
                                <div
                                  className="bg-blue-700 dark:bg-blue-900 w-full rounded-b"
                                  style={{ height: `${height}px` }}
                                ></div>
                                <div className="text-xs mt-2">{month}</div>
                              </div>
                            )
                          })}
                        </div>
                        <div className="flex items-center justify-center mt-4 space-x-6 text-sm">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-700 dark:bg-blue-900 mr-2"></div>
                            <span>Sent</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 dark:bg-blue-600 mr-2"></div>
                            <span>Opened</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-200 dark:bg-blue-800/50 mr-2"></div>
                            <span>Clicked</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Top Performing Newsletters */}
                      <div>
                        <h3 className="font-medium mb-4">Top Performing Newsletters</h3>
                        <div className="space-y-3">
                          {state.newsletters
                            .filter(n => n.status === "Sent")
                            .sort((a, b) => parseInt(a.openRate) > parseInt(b.openRate) ? -1 : 1)
                            .slice(0, 3)
                            .map((newsletter, i) => (
                              <div key={newsletter.id} className="flex items-center p-3 border rounded-md">
                                <div className="mr-4 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold">
                                  {i + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{newsletter.subject}</p>
                                  <p className="text-xs text-muted-foreground">{newsletter.sentDate}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-green-600">{newsletter.openRate} open rate</p>
                                  <p className="text-xs text-muted-foreground">{newsletter.clickRate} click rate</p>
                                </div>
                              </div>
                            ))
                          }
                          {state.newsletters.filter(n => n.status === "Sent").length === 0 && (
                            <div className="flex flex-col items-center justify-center py-8">
                              <BarChart3 className="h-10 w-10 text-gray-400 mb-2" />
                              <p className="text-muted-foreground">No sent newsletters to analyze</p>
                              <p className="text-sm text-muted-foreground">Send your first newsletter to see analytics</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </motion.div>
    </div>
  )
}

