"use client"

import type React from "react"
import { createContext, useContext, useReducer, useCallback, useEffect } from "react"
import { useToast } from "../../hooks/use-toastv2"    
import { useAuth } from "../../lib/contexts/AuthContext"
import { USER_ROLES } from "../../lib/constants"

// API URL constant
const API_URL = "http://localhost:3000/api"

// Types
interface User {
  id: number
  name: string
  email: string
  role: string
  registrationDate: string
  status: string
  articles: number
  lastLogin: string
  avatar: string
}

interface Article {
  id: number
  title: string
  author: string
  publishDate: string
  status: string
  views: number
  category: string
  wordCount: number
}

interface Newsletter {
  id: number
  subject: string
  sentDate: string
  recipients: number
  openRate: string
  clickRate: string
  status: string
}

interface DatabaseTable {
  name: string
  rows: number
  size: string
  lastModified: string
}

interface AdminState {
  users: User[]
  articles: Article[]
  newsletters: Newsletter[]
  databaseTables: DatabaseTable[]
  selectedUsers: number[]
  selectedArticles: number[]
  loading: boolean
  error: string | null
  currentUserRole: string | null
  currentUserEmail: string | null
  currentUserId: number | null
  articleStats: any
  newsletterStats: any
  dashboardStats: any
}

type AdminAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_USERS"; payload: User[] }
  | { type: "SET_ARTICLES"; payload: Article[] }
  | { type: "SET_NEWSLETTERS"; payload: Newsletter[] }
  | { type: "SET_DATABASE_TABLES"; payload: DatabaseTable[] }
  | { type: "UPDATE_USER"; payload: { id: number; updates: Partial<User> } }
  | { type: "UPDATE_ARTICLE"; payload: { id: number; updates: Partial<Article> } }
  | { type: "DELETE_USER"; payload: number }
  | { type: "DELETE_ARTICLE"; payload: number }
  | { type: "SELECT_USERS"; payload: number[] }
  | { type: "SELECT_ARTICLES"; payload: number[] }
  | { type: "BULK_UPDATE_USERS"; payload: { ids: number[]; updates: Partial<User> } }
  | { type: "BULK_UPDATE_ARTICLES"; payload: { ids: number[]; updates: Partial<Article> } }
  | { type: "SET_CURRENT_USER"; payload: { id: number; email: string; role: string } }
  | { type: "ADD_NEWSLETTER"; payload: Newsletter }
  | { type: "ADD_USER"; payload: User }
  | { type: "ADD_ARTICLE"; payload: Article }
  | { type: "SET_ARTICLE_STATS"; payload: any }
  | { type: "SET_NEWSLETTER_STATS"; payload: any }
  | { type: "SET_DASHBOARD_STATS"; payload: any }

// Initial state
const initialState: AdminState = {
  users: [],
  articles: [],
  newsletters: [],
  databaseTables: [],
  selectedUsers: [],
  selectedArticles: [],
  loading: false,
  error: null,
  currentUserRole: null,
  currentUserEmail: null,
  currentUserId: null,
  articleStats: null,
  newsletterStats: null,
  dashboardStats: null
}

function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    case "SET_USERS":
      return { ...state, users: action.payload }
    case "SET_ARTICLES":
      return { ...state, articles: action.payload }
    case "SET_NEWSLETTERS":
      return { ...state, newsletters: action.payload }
    case "SET_DATABASE_TABLES":
      return { ...state, databaseTables: action.payload }
    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id ? { ...user, ...action.payload.updates } : user
        ),
      }
    case "UPDATE_ARTICLE":
      return {
        ...state,
        articles: state.articles.map((article) =>
          article.id === action.payload.id ? { ...article, ...action.payload.updates } : article
        ),
      }
    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
        selectedUsers: state.selectedUsers.filter((id) => id !== action.payload),
      }
    case "DELETE_ARTICLE":
      return {
        ...state,
        articles: state.articles.filter((article) => article.id !== action.payload),
        selectedArticles: state.selectedArticles.filter((id) => id !== action.payload),
      }
    case "SELECT_USERS":
      return { ...state, selectedUsers: action.payload }
    case "SELECT_ARTICLES":
      return { ...state, selectedArticles: action.payload }
    case "BULK_UPDATE_USERS":
      return {
        ...state,
        users: state.users.map((user) =>
          action.payload.ids.includes(user.id) ? { ...user, ...action.payload.updates } : user
        ),
      }
    case "BULK_UPDATE_ARTICLES":
      return {
        ...state,
        articles: state.articles.map((article) =>
          action.payload.ids.includes(article.id) ? { ...article, ...action.payload.updates } : article
        ),
      }
    case "SET_CURRENT_USER":
      return {
        ...state,
        currentUserId: action.payload.id,
        currentUserEmail: action.payload.email,
        currentUserRole: action.payload.role,
      }
    case "ADD_NEWSLETTER":
      return { ...state, newsletters: [...state.newsletters, action.payload] }
    case "ADD_USER":
      return { ...state, users: [...state.users, action.payload] }
    case "ADD_ARTICLE":
      return { ...state, articles: [...state.articles, action.payload] }
    case "SET_ARTICLE_STATS":
      return { ...state, articleStats: action.payload }
    case "SET_NEWSLETTER_STATS":
      return { ...state, newsletterStats: action.payload }
    case "SET_DASHBOARD_STATS":
      return { ...state, dashboardStats: action.payload }
    default:
      return state
  }
}

interface AdminContextType {
  state: AdminState
  dispatch: React.Dispatch<AdminAction>
  // User actions
  fetchUsers: () => Promise<void>
  promoteUser: (userId: number) => Promise<void>
  demoteUser: (userId: number) => Promise<void>
  deleteUser: (userId: number) => Promise<void>
  bulkUpdateUsers: (userIds: number[], updates: Partial<User>) => Promise<void>
  // Article actions
  fetchArticles: () => Promise<void>
  approveArticle: (articleId: number) => Promise<void>
  rejectArticle: (articleId: number) => Promise<void>
  deleteArticle: (articleId: number) => Promise<void>
  bulkUpdateArticles: (articleIds: number[], updates: Partial<Article>) => Promise<void>
  // Newsletter actions
  fetchNewsletters: () => Promise<void>
  sendNewsletter: (newsletterId: number) => Promise<void>
  createNewsletter: (subject: string, content: string) => Promise<Newsletter>
  // Database actions
  fetchDatabaseStats: () => Promise<void>
  // Dashboard actions
  fetchDashboardStats: () => Promise<void>
  // Authentication
  checkAdminAccess: () => Promise<boolean>
  getCurrentUserRole: () => string | null
  // Utility functions
  selectUsers: (userIds: number[]) => void
  selectArticles: (articleIds: number[]) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(adminReducer, initialState)
  const { toast } = useToast()
  const { user } = useAuth()
  
  // Initialize admin state with user info from global auth context
  useEffect(() => {
    if (user) {
      let role = "User"
      
      // Case-insensitive role check
      const userRole = user.role?.toLowerCase()
      
      if (userRole === USER_ROLES.ADMIN.toLowerCase() || 
          userRole === USER_ROLES.OWNER.toLowerCase()) {
        role = "Admin"
      } else if (userRole === USER_ROLES.WRITER.toLowerCase()) {
        role = "Author"
      }
      
      dispatch({
        type: "SET_CURRENT_USER", 
        payload: {
          id: parseInt(user._id) || 1,
          email: user.email,
          role
        }
      })

      // Removed auto-loading admin data to resolve circular dependency issues
    }
  }, [user])
  
  // Check if user has admin access
  const checkAdminAccess = useCallback(async () => {
    // First check if we have admin role in state
    if (state.currentUserRole === "Admin" || state.currentUserRole === "Owner") return true;
    
    try {
      // Call the admin verification endpoint
      const response = await fetch(`${API_URL}/admin/verify-admin`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.isAdmin === true;
      } else {
        console.error("Admin verification failed:", await response.text());
        return false;
      }
    } catch (error) {
      console.error("Error checking admin access:", error);
      
      // Fall back to checking the auth context user
      if (user && user.role) {
        const userRole = user.role.toLowerCase();
        return userRole === 'admin' || userRole === 'owner';
      }
      
      return false;
    }
  }, [state.currentUserRole, user])
  
  // Get current user role
  const getCurrentUserRole = useCallback(() => {
    return state.currentUserRole;
  }, [state.currentUserRole]);
  
  // User actions
  const fetchUsers = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      // Call the users API
      const response = await fetch(`${API_URL}/admin/users`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      })
      
      if (!response.ok) throw new Error("Failed to fetch users")
      const data = await response.json()
      
      // Make sure we have the correct data format
      const formattedUsers = data.map((user: any) => ({
        id: user.id || user._id,
        name: user.name || 'Unknown',
        email: user.email || '',
        role: user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User',
        registrationDate: user.registrationDate || user.createdAt || new Date().toISOString(),
        status: user.status || 'Active',
        articles: user.articles || 0,
        lastLogin: user.lastLogin || user.createdAt || new Date().toISOString(),
        avatar: user.avatar || ''
      }));
      
      dispatch({ type: "SET_USERS", payload: formattedUsers })
      return formattedUsers
    } catch (error) {
      console.error("Error fetching users:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch users" })
      throw error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])
  
  const promoteUser = useCallback(async (userId: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      // Prevent self-demotion for admin
      const user = state.users.find(u => u.id === userId)
      if (userId === state.currentUserId && user?.role === "Admin") {
        throw new Error("You cannot demote yourself as an admin")
      }
      
      const response = await fetch(`${API_URL}/admin/users/${userId}/promote`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      if (!response.ok) {
        throw new Error("Failed to promote user")
      }
      
      const data = await response.json()
      
      // Update user role based on the response
      dispatch({
        type: "UPDATE_USER",
        payload: {
          id: userId,
          updates: { role: data.user.role.charAt(0).toUpperCase() + data.user.role.slice(1) },
        },
      })
      
      toast({
        title: "Success",
        description: `User ${data.user.name} has been promoted to ${data.user.role}.`,
      })
      
    } catch (error) {
      console.error("Error promoting user:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to promote user" })
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to promote user. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [state.users, state.currentUserId, toast])
  
  const demoteUser = useCallback(async (userId: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      // Prevent self-demotion for admin
      if (userId === state.currentUserId && state.currentUserRole === "Admin") {
        throw new Error("You cannot demote yourself as an admin")
      }
      
      const response = await fetch(`${API_URL}/admin/users/${userId}/demote`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      if (!response.ok) {
        throw new Error("Failed to demote user")
      }
      
      const data = await response.json()
      
      dispatch({
        type: "UPDATE_USER",
        payload: {
          id: userId,
          updates: { role: data.user.role.charAt(0).toUpperCase() + data.user.role.slice(1) },
        },
      })
      
      toast({
        title: "Success",
        description: `User ${data.user.name} has been demoted to ${data.user.role}.`,
      })
      
    } catch (error) {
      console.error("Error demoting user:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to demote user" })
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to demote user. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [state.currentUserId, state.currentUserRole, toast])
  
  const deleteUser = useCallback(async (userId: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      // Prevent self-deletion for admin
      if (userId === state.currentUserId) {
        throw new Error("You cannot delete your own account")
      }
      
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete user")
      }
      
      dispatch({ type: "DELETE_USER", payload: userId })
      
      toast({
        title: "Success",
        description: "User has been deleted successfully.",
      })
      
    } catch (error) {
      console.error("Error deleting user:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to delete user" })
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [state.currentUserId, toast])
  
  const bulkUpdateUsers = useCallback(async (userIds: number[], updates: Partial<User>) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      // Prevent bulk actions that would affect current admin
      if (userIds.includes(state.currentUserId || 0) && 
          updates.role && 
          updates.role !== "Admin" && 
          state.currentUserRole === "Admin") {
        throw new Error("You cannot demote yourself as an admin")
      }
      
      const response = await fetch(`${API_URL}/users/bulk-update`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds, updates }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to update users")
      }
      
      dispatch({
        type: "BULK_UPDATE_USERS",
        payload: { ids: userIds, updates },
      })
      
      toast({
        title: "Success",
        description: `Updated ${userIds.length} users successfully.`,
      })
      
    } catch (error) {
      console.error("Error updating users:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to update users" })
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update users. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [state.currentUserId, state.currentUserRole, toast])
  
  // Article actions
  const fetchArticles = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      const response = await fetch(`${API_URL}/admin/articles`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) throw new Error("Failed to fetch articles")
      const data = await response.json()
      
      // Make sure we have the correct data format
      const formattedArticles = data.map((article: any) => ({
        id: article.id || article._id,
        title: article.title || '',
        author: article.author?.name || article.author?.username || (typeof article.author === 'string' ? article.author : 'Unknown'),
        publishDate: article.publishDate || article.createdAt || new Date().toISOString(),
        status: article.status ? article.status.charAt(0).toUpperCase() + article.status.slice(1) : 'Draft',
        views: article.views || 0,
        category: article.category || 'Uncategorized',
        wordCount: article.wordCount || article.content?.split(' ').length || 0,
      }));
      
      dispatch({ type: "SET_ARTICLES", payload: formattedArticles })
      return formattedArticles
    } catch (error) {
      console.error("Error fetching articles:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch articles" })
      throw error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])
  
  const approveArticle = useCallback(async (articleId: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      const article = state.articles.find(a => a.id === articleId)
      
      // Prevent authors from approving their own articles
      if (article && article.author === state.currentUserEmail && state.currentUserRole !== "Admin") {
        throw new Error("You cannot approve your own article")
      }
      
      const response = await fetch(`${API_URL}/articles/${articleId}/approve`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      if (!response.ok) {
        throw new Error("Failed to approve article")
      }
      
      const data = await response.json()
      
      dispatch({
        type: "UPDATE_ARTICLE",
        payload: {
          id: articleId,
          updates: { status: "Published" },
        },
      })
      
      toast({
        title: "Success",
        description: "Article has been approved and published.",
      })
      
    } catch (error) {
      console.error("Error approving article:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to approve article" })
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to approve article. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [state.articles, state.currentUserEmail, state.currentUserRole, toast])
  
  const rejectArticle = useCallback(async (articleId: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      const response = await fetch(`${API_URL}/articles/${articleId}/reject`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      if (!response.ok) {
        throw new Error("Failed to reject article")
      }
      
      dispatch({
        type: "UPDATE_ARTICLE",
        payload: {
          id: articleId,
          updates: { status: "Rejected" },
        },
      })
      
      toast({
        title: "Success",
        description: "Article has been rejected.",
      })
      
    } catch (error) {
      console.error("Error rejecting article:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to reject article" })
      toast({
        title: "Error",
        description: "Failed to reject article. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [toast])
  
  const deleteArticle = useCallback(async (articleId: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      const response = await fetch(`${API_URL}/articles/${articleId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete article")
      }
      
      dispatch({ type: "DELETE_ARTICLE", payload: articleId })
      
      toast({
        title: "Success",
        description: "Article has been deleted successfully.",
      })
      
    } catch (error) {
      console.error("Error deleting article:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to delete article" })
      toast({
        title: "Error",
        description: "Failed to delete article. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [toast])
  
  const bulkUpdateArticles = useCallback(async (articleIds: number[], updates: Partial<Article>) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      // No self-approval check for bulk operations
      if (updates.status === "Published" && state.currentUserRole !== "Admin") {
        const userArticles = state.articles.filter(a => 
          articleIds.includes(a.id) && a.author === state.currentUserEmail
        )
        
        if (userArticles.length > 0) {
          throw new Error("You cannot approve your own articles")
        }
      }
      
      const response = await fetch(`${API_URL}/articles/bulk-update`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articleIds, updates }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to update articles")
      }
      
      dispatch({
        type: "BULK_UPDATE_ARTICLES",
        payload: { ids: articleIds, updates },
      })
      
      toast({
        title: "Success",
        description: `Updated ${articleIds.length} articles successfully.`,
      })
      
    } catch (error) {
      console.error("Error updating articles:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to update articles" })
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update articles. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [state.articles, state.currentUserEmail, state.currentUserRole, toast])
  
  // Newsletter actions
  const fetchNewsletters = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      // Call the newsletters API
      const response = await fetch(`${API_URL}/admin/stats/newsletter`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      
      if (!response.ok) throw new Error("Failed to fetch newsletters")
      const data = await response.json()
      
      // Convert backend data format to the format expected by the frontend
      const formattedNewsletters = data.recentNewsletters.map(newsletter => ({
        id: newsletter._id,
        subject: newsletter.subject,
        sentDate: newsletter.sentDate ? new Date(newsletter.sentDate).toLocaleDateString() : 'Not sent',
        recipients: newsletter.recipients || 0,
        openRate: newsletter.openRate || '0%',
        clickRate: newsletter.clickRate || '0%',
        status: newsletter.status
      }));
      
      dispatch({ type: "SET_NEWSLETTERS", payload: formattedNewsletters })
      
      // Store the raw statistics for other components to use
      dispatch({ type: "SET_NEWSLETTER_STATS", payload: data })
      
      return data
    } catch (error) {
      console.error("Error fetching newsletters:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch newsletters" })
      throw error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])
  
  const sendNewsletter = useCallback(async (newsletterId: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      const response = await fetch(`${API_URL}/newsletters/${newsletterId}/send`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      if (!response.ok) {
        throw new Error("Failed to send newsletter")
      }
      
      const data = await response.json()
      
      dispatch({
        type: "UPDATE_ARTICLE",
        payload: {
          id: newsletterId,
          updates: { 
            status: "Sent",
            sentDate: new Date().toISOString().split('T')[0]
          } as Partial<Newsletter>,
        },
      })
      
      toast({
        title: "Success",
        description: "Newsletter has been sent successfully.",
      })
      
    } catch (error) {
      console.error("Error sending newsletter:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to send newsletter" })
      toast({
        title: "Error",
        description: "Failed to send newsletter. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [toast])
  
  const createNewsletter = useCallback(async (subject: string, content: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      const response = await fetch(`${API_URL}/newsletters`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, content }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to create newsletter")
      }
      
      const data = await response.json()
      dispatch({ type: "ADD_NEWSLETTER", payload: data })
      
      toast({
        title: "Success",
        description: "Newsletter has been created successfully.",
      })
      
      return data
      
    } catch (error) {
      console.error("Error creating newsletter:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to create newsletter" })
      toast({
        title: "Error",
        description: "Failed to create newsletter. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [toast])
  
  // Database actions
  const fetchDatabaseStats = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      const response = await fetch(`${API_URL}/admin/stats`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch database stats")
      }
      
      const data = await response.json()
      dispatch({ type: "SET_DATABASE_TABLES", payload: data })
      
    } catch (error) {
      console.error("Error fetching database stats:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch database stats" })
      toast({
        title: "Error",
        description: "Failed to fetch database statistics. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [toast])
  
  // Dashboard actions
  const fetchDashboardStats = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      const response = await fetch(`${API_URL}/admin/stats`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats")
      }
      
      const data = await response.json()
      dispatch({ type: "SET_DASHBOARD_STATS", payload: data })
      
      return data
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch dashboard statistics" })
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [toast])
  
  // Utility functions
  const selectUsers = useCallback((userIds: number[]) => {
    dispatch({ type: "SELECT_USERS", payload: userIds })
  }, [])
  
  const selectArticles = useCallback((articleIds: number[]) => {
    dispatch({ type: "SELECT_ARTICLES", payload: articleIds })
  }, [])

  return (
    <AdminContext.Provider
      value={{
        state,
        dispatch,
        fetchUsers,
        promoteUser,
        demoteUser,
        deleteUser,
        bulkUpdateUsers,
        fetchArticles,
        approveArticle,
        rejectArticle,
        deleteArticle,
        bulkUpdateArticles,
        fetchNewsletters,
        sendNewsletter,
        createNewsletter,
        fetchDatabaseStats,
        fetchDashboardStats,
        checkAdminAccess,
        getCurrentUserRole,
        selectUsers,
        selectArticles,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

// Custom hook for accessing admin context
export function useAdmin() {
  const context = useContext(AdminContext)
  
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  
  return context
}

