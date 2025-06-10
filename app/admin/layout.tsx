"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { SidebarProvider } from "../components/ui/sidebar"
import { AdminSidebar } from "../components/admin/admin-sidebar"
import { AdminHeader } from "../components/admin/admin-header"
import { AdminProvider, useAdmin } from "../components/admin/admin-context"
import { Toaster } from "../components/ui/toaster"
import { useAuth } from "../lib/contexts/AuthContext"
import { USER_ROLES } from "../lib/constants"

// Admin Layout with role-based access control
function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const { checkAdminAccess, getCurrentUserRole } = useAdmin()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Verify admin access using the server-side verification
  useEffect(() => {
    const verifyAccess = async () => {
      try {
        setIsLoading(true);
        // Direct server verification
        const hasAccess = await checkAdminAccess();
        setIsAuthorized(hasAccess);
        
        if (!hasAccess) {
          navigate("/");
          console.log("Unauthorized user redirected to home page");
        }
      } catch (error) {
        console.error("Error verifying admin access:", error);
        setIsAuthorized(false);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyAccess();
  }, [checkAdminAccess, navigate]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-blue-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }
  
  // Show admin panel for authorized users
  if (isAuthorized) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <AdminHeader />
            <main className="flex-1 overflow-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6"
              >
                {children}
              </motion.div>
            </main>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    )
  }
  
  // This should not be visible as we redirect unauthorized users
  return null
}

// Wrapper component that provides the AdminContext
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  )
}

