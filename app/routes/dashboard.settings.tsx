"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mail, Lock, Bell, Eye, EyeOff, Check, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Switch } from "../components/ui/switch"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { useAuth } from "../lib/contexts/AuthContext"
import { useToast } from "../hooks/use-toast"
import { userService } from "../lib/services/userService"

export default function SettingsPage() {
  const { user, sendVerificationEmail } = useAuth()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const [notificationsInitialized, setNotificationsInitialized] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    articleUpdates: true,
    weeklyDigest: true,
    commentNotifications: true,
    likeNotifications: false,
  })
  const { toast } = useToast()

  // Fetch notification settings on component mount
  useEffect(() => {
    async function fetchNotificationSettings() {
      try {
        setNotificationsLoading(true);
        const settings = await userService.getNotificationSettings();
        setNotifications(settings);
        setNotificationsInitialized(true);
      } catch (error) {
        console.error("Error fetching notification settings:", error);
        toast({
          title: "Failed to load notification settings",
          description: "Using default settings instead.",
          type: "error"
        });
      } finally {
        setNotificationsLoading(false);
      }
    }

    if (user && !notificationsInitialized) {
      fetchNotificationSettings();
    }
  }, [user, notificationsInitialized, toast]);

  const handleVerifyEmail = async () => {
    try {
      setVerifyLoading(true);
      await sendVerificationEmail();
      toast({
        title: "Verification email sent",
        description: "Please check your inbox and click the verification link.",
        type: "success"
      });
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast({
        title: "Failed to send verification email",
        description: "Please try again later.",
        type: "error"
      });
    } finally {
      setVerifyLoading(false);
    }
  }

  const handlePasswordReset = async () => {
    // Validate password fields
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Your new password and confirmation do not match.",
        type: "error"
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Your new password must be at least 8 characters long.",
        type: "error"
      });
      return;
    }

    try {
      setPasswordLoading(true);
      await userService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Clear form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
        type: "success"
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Password update failed",
        description: "Please check your current password and try again.",
        type: "error"
      });
    } finally {
      setPasswordLoading(false);
    }
  }

  const handleNotificationChange = async (key: string, value: boolean) => {
    // Optimistically update UI
    const updatedNotifications = { ...notifications, [key]: value };
    setNotifications(updatedNotifications);
    
    try {
      setNotificationsLoading(true);
      await userService.updateNotificationSettings(updatedNotifications);
      
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
        type: "success"
      });
    } catch (error) {
      console.error("Error updating notification settings:", error);
      // Revert the change if the update failed
      setNotifications(notifications);
      
      toast({
        title: "Update failed",
        description: "Failed to update notification settings.",
        type: "error"
      });
    } finally {
      setNotificationsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account security and notification preferences</p>
        </div>
      </motion.div>

      <div className="grid gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Email Verification</span>
              </CardTitle>
              <CardDescription>
                Verify your email address to secure your account and receive important updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">{user?.email}</div>
                  {user?.emailVerified ? (
                    <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                      <Check className="h-4 w-4 mr-1" />
                      Verified
                    </div>
                  ) : (
                    <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Not verified
                    </div>
                  )}
                </div>
                {!user?.emailVerified && (
                  <Button onClick={handleVerifyEmail} variant="outline" disabled={verifyLoading}>
                    {verifyLoading ? (
                      <span className="flex items-center">
                        <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Sending...
                      </span>
                    ) : (
                      "Send verification email"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Password & Security</span>
              </CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-8 w-8"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-8 w-8"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-8 w-8"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button onClick={handlePasswordReset} className="w-full" disabled={passwordLoading}>
                  {passwordLoading ? (
                    <span className="flex items-center">
                      <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Updating...
                    </span>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                    disabled={notificationsLoading}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                    disabled={notificationsLoading}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Article Updates</Label>
                    <p className="text-sm text-muted-foreground">Get notified when new articles are published</p>
                  </div>
                  <Switch
                    checked={notifications.articleUpdates}
                    onCheckedChange={(checked) => handleNotificationChange("articleUpdates", checked)}
                    disabled={notificationsLoading}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">Receive a weekly summary of new research</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) => handleNotificationChange("weeklyDigest", checked)}
                    disabled={notificationsLoading}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Comment Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified when someone comments on your articles</p>
                  </div>
                  <Switch
                    checked={notifications.commentNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("commentNotifications", checked)}
                    disabled={notificationsLoading}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Like Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified when someone likes your articles</p>
                  </div>
                  <Switch
                    checked={notifications.likeNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("likeNotifications", checked)}
                    disabled={notificationsLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 