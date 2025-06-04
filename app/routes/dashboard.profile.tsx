"use client"

import { useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { Camera, Upload, X, Save, User, Mail, AlertCircle, BadgeInfo } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Textarea } from "../components/ui/textarea"
import { useAuth } from "../lib/contexts/AuthContext"
import { useToast } from "../hooks/use-toast"
import { userService } from "../lib/services/userService"

// Define custom ToastProps with variant
interface CustomToastProps {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    name: user?.name || "",
    bio: user?.bio || "",
    title: user?.title || "",
    avatar: user?.avatar || "/placeholder.svg"
  })
  const [isEditing, setIsEditing] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userStats, setUserStats] = useState({
    totalArticles: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0
  })
  const { toast } = useToast()

  // Fetch user statistics
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const stats = await userService.getUserStatistics();
        setUserStats(stats);
      } catch (error) {
        console.error("Error fetching user statistics:", error);
      }
    };

    fetchUserStats();
  }, []);

  const onDrop = useCallback((file: File) => {
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onDrop(e.dataTransfer.files[0]);
    }
  }, [onDrop]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onDrop(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Upload avatar if there's a new one
      let avatarUrl = profileData.avatar;
      if (avatarFile) {
        const response = await userService.uploadAvatar(avatarFile);
        avatarUrl = response.url;
        console.log("Uploaded avatar URL:", avatarUrl);
      }
      
      // Update profile data
      const updatedUser = await userService.updateProfile({
        username: profileData.username,
        name: profileData.name,
        bio: profileData.bio,
        title: profileData.title,
        avatar: avatarUrl
      });
      
      // Update local state
      setProfileData(prev => ({
        ...prev,
        ...updatedUser,
        avatar: avatarUrl
      }));
      
      // Update user in auth context to keep it in sync
      updateUser({
        ...updatedUser,
        avatar: avatarUrl
      });
      
      setAvatarPreview(null);
      setAvatarFile(null);
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        type: "success"
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to current user data
    setProfileData({
      username: user?.username || "",
      email: user?.email || "",
      name: user?.name || "",
      bio: user?.bio || "",
      title: user?.title || "",
      avatar: user?.avatar || "/placeholder.svg"
    });
    setAvatarPreview(null);
    setAvatarFile(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? (
                  <span className="flex items-center">
                    <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-3">
        <motion.div
          className="md:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Upload a new avatar to personalize your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={avatarPreview || profileData.avatar} alt="Profile picture" />
                    <AvatarFallback className="text-2xl">
                      {profileData.username
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0 rounded-full"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {isEditing && (
                  <div className="w-full">
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        isDragging
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                    >
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {isDragging ? "Drop the image here" : "Drag & drop an image, or click to select"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>

                    {avatarPreview && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-green-700 dark:text-green-400">New image ready to save</p>
                          <Button size="sm" variant="ghost" onClick={() => {
                            setAvatarPreview(null);
                            setAvatarFile(null);
                          }}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, username: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                      disabled={true} // Email changes should go through a verification process
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-10"
                      placeholder="Your display name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title/Position</Label>
                  <div className="relative">
                    <BadgeInfo className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="title"
                      value={profileData.title}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, title: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-10"
                      placeholder="e.g. Researcher, Professor, etc."
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={handleCancel} disabled={loading}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={loading}>
                    {loading ? (
                      <span className="flex items-center">
                        <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving...
                      </span>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
            <CardDescription>Overview of your account activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userStats.totalArticles}</div>
                <div className="text-sm text-muted-foreground">Articles Published</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{userStats.totalViews}</div>
                <div className="text-sm text-muted-foreground">Total Views</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{userStats.totalLikes}</div>
                <div className="text-sm text-muted-foreground">Likes Received</div>
              </div>
              <div className="text-center p-4 rounded-lg border">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{userStats.totalComments}</div>
                <div className="text-sm text-muted-foreground">Comments</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 