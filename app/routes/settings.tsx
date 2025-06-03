"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Lock, Bell, Shield, Eye, EyeOff, Check, AlertCircle } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Checkbox } from "../components/ui/checkbox"
import { useAuth } from "../lib/contexts/AuthContext"
import PasswordStrength from "../components/auth/password-strength"

export default function SettingsRoute() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"password" | "notifications" | "privacy">("password")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    articleUpdates: true,
    newComments: true,
    marketingEmails: false
  })
  
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    allowDataCollection: true
  })

  // Redirect if not logged in
  if (!user) {
    navigate("/auth")
    return null
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }
  
  const handleNotificationChange = (setting: keyof typeof notificationSettings, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [setting]: checked }))
  }
  
  const handlePrivacyChange = (setting: keyof typeof privacySettings, value: any) => {
    setPrivacySettings((prev) => ({ ...prev, [setting]: value }))
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" })
      return
    }
    
    // This would be implemented in a future step
    setMessage({ type: "success", text: "Password updated successfully!" })
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
    
    // Clear the message after 3 seconds
    setTimeout(() => setMessage(null), 3000)
  }
  
  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // This would be implemented in a future step
    setMessage({ type: "success", text: "Notification preferences saved!" })
    
    // Clear the message after 3 seconds
    setTimeout(() => setMessage(null), 3000)
  }
  
  const handlePrivacySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // This would be implemented in a future step
    setMessage({ type: "success", text: "Privacy settings updated!" })
    
    // Clear the message after 3 seconds
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="container max-w-4xl py-12">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`px-6 py-4 text-sm font-medium flex items-center ${
                activeTab === "password"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("password")}
            >
              <Lock className="h-4 w-4 mr-2" />
              Password
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium flex items-center ${
                activeTab === "notifications"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("notifications")}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium flex items-center ${
                activeTab === "privacy"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("privacy")}
            >
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </button>
          </div>
          
          <div className="p-6">
            {message && (
              <motion.div 
                className={`rounded-md p-4 mb-6 ${
                  message.type === "success" 
                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" 
                    : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center">
                  {message.type === "success" ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mr-2" />
                  )}
                  <span>{message.text}</span>
                </div>
              </motion.div>
            )}
            
            {activeTab === "password" && (
              <motion.form 
                onSubmit={handlePasswordSubmit}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-8 w-8"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showCurrentPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-8 w-8"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showNewPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                  {passwordData.newPassword && <PasswordStrength password={passwordData.newPassword} />}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-8 w-8"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                  {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={
                    !passwordData.currentPassword || 
                    !passwordData.newPassword || 
                    !passwordData.confirmPassword ||
                    passwordData.newPassword !== passwordData.confirmPassword
                  }
                >
                  Update Password
                </Button>
              </motion.form>
            )}
            
            {activeTab === "notifications" && (
              <motion.form 
                onSubmit={handleNotificationsSubmit}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="emailNotifications" 
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("emailNotifications", !!checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="emailNotifications" className="text-sm font-medium">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="articleUpdates" 
                      checked={notificationSettings.articleUpdates}
                      onCheckedChange={(checked) => handleNotificationChange("articleUpdates", !!checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="articleUpdates" className="text-sm font-medium">Article Updates</Label>
                      <p className="text-sm text-muted-foreground">Get notified when articles you follow are updated</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="newComments" 
                      checked={notificationSettings.newComments}
                      onCheckedChange={(checked) => handleNotificationChange("newComments", !!checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="newComments" className="text-sm font-medium">New Comments</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications for new comments on your articles</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="marketingEmails" 
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) => handleNotificationChange("marketingEmails", !!checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="marketingEmails" className="text-sm font-medium">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive promotional emails and newsletters</p>
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  Save Notification Preferences
                </Button>
              </motion.form>
            )}
            
            {activeTab === "privacy" && (
              <motion.form 
                onSubmit={handlePrivacySubmit}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profileVisibility">Profile Visibility</Label>
                    <select
                      id="profileVisibility"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={privacySettings.profileVisibility}
                      onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                    >
                      <option value="public">Public - Anyone can view your profile</option>
                      <option value="registered">Registered Users - Only registered users can view your profile</option>
                      <option value="private">Private - Only you can view your profile</option>
                    </select>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="showEmail" 
                      checked={privacySettings.showEmail}
                      onCheckedChange={(checked) => handlePrivacyChange("showEmail", !!checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="showEmail" className="text-sm font-medium">Show Email Address</Label>
                      <p className="text-sm text-muted-foreground">Display your email address on your public profile</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="allowDataCollection" 
                      checked={privacySettings.allowDataCollection}
                      onCheckedChange={(checked) => handlePrivacyChange("allowDataCollection", !!checked)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="allowDataCollection" className="text-sm font-medium">Allow Data Collection</Label>
                      <p className="text-sm text-muted-foreground">Allow us to collect usage data to improve your experience</p>
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  Save Privacy Settings
                </Button>
              </motion.form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
} 