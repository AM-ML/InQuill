"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { User, Mail, Upload, Check, AlertCircle } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useAuth } from "../lib/contexts/AuthContext"

const DEFAULT_AVATAR_URL = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficons.iconarchive.com%2Ficons%2Fpapirus-team%2Fpapirus-status%2F128%2Favatar-default-icon.png&f=1&nofb=1&ipt=7d64dc7f75f630f5a2c012812ed8ebb73f1625630d69614d2665bc70c0641e73"

export default function ProfileRoute() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  })

  // Redirect if not logged in
  if (!user) {
    navigate("/auth")
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // This would be implemented in a future step
    setMessage({ type: "success", text: "Profile updated successfully!" })
    setIsEditing(false)
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    // This would be implemented in a future step
    setTimeout(() => {
      setIsUploading(false)
      setMessage({ type: "success", text: "Avatar uploaded successfully!" })
      
      // Clear the message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    }, 1500)
  }

  return (
    <div className="container max-w-4xl py-12">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="relative group">
              <div className="h-40 w-40 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                <img 
                  src={user.avatar || DEFAULT_AVATAR_URL} 
                  alt={`${user.username}'s avatar`}
                  className="h-full w-full object-cover"
                />
              </div>
              <label 
                htmlFor="avatar-upload" 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                {isUploading ? (
                  <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Upload className="h-6 w-6" />
                    <span className="sr-only">Upload new avatar</span>
                  </>
                )}
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarUpload}
                disabled={isUploading}
              />
            </div>
            <h2 className="mt-4 text-xl font-semibold">{user.username}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                {user.role}
              </span>
            </div>
          </div>

          <div className="w-full md:w-2/3 space-y-6">
            {message && (
              <motion.div 
                className={`rounded-md p-4 ${
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

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Profile Information</h3>
                <Button 
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                  <p className="text-sm text-amber-500 dark:text-amber-400 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Email verification coming soon
                  </p>
                </div>

                {isEditing && (
                  <Button type="submit" className="w-full">
                    Save Changes
                  </Button>
                )}
              </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">My Articles</h3>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Article writing functionality coming soon!</p>
                <Button className="mt-4" onClick={() => navigate("/articles")}>
                  Browse Articles
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 