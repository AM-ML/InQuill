"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { cn } from "../../lib/utils"

interface SidebarContextType {
  isExpanded: boolean
  isMobileOpen: boolean
  setIsExpanded: (value: boolean) => void
  setIsMobileOpen: (value: boolean) => void
  toggleExpanded: () => void
  toggleMobileOpen: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)

  // Check if we're in a mobile view on initial render and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    
    // Initial check
    checkMobile()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleExpanded = () => {
    if (isMobileView) {
      setIsMobileOpen(prev => !prev)
    } else {
      setIsExpanded(prev => !prev)
    }
  }
  
  const toggleMobileOpen = () => {
    setIsMobileOpen(prev => !prev)
  }

  return (
    <SidebarContext.Provider value={{ 
      isExpanded, 
      isMobileOpen, 
      setIsExpanded, 
      setIsMobileOpen, 
      toggleExpanded, 
      toggleMobileOpen 
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const { isExpanded, isMobileOpen } = useSidebar()
  const [isMobileView, setIsMobileView] = useState(false)
  
  // Check if we're in a mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    
    // Initial check
    checkMobile()
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <aside
      className={cn(
        "group flex flex-col h-screen bg-white dark:bg-gray-950 transition-all duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-20",
        isMobileView ? (
          isMobileOpen 
            ? "fixed left-0 top-0 z-40 shadow-xl" 
            : "fixed -left-full md:left-0 top-0 z-40"
        ) : "",
        className,
      )}
      {...props}
    />
  )
}

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  return <div className={cn("", className)} {...props} />
}

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarContent({ className, ...props }: SidebarContentProps) {
  return <div className={cn("flex-1 overflow-y-auto", className)} {...props} />
}

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  return <div className={cn("", className)} {...props} />
}

interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
}

export function SidebarTrigger({ className, icon, ...props }: SidebarTriggerProps) {
  const { toggleExpanded } = useSidebar()
  
  return (
    <button
      type="button"
      onClick={toggleExpanded}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10",
        className,
      )}
      {...props}
    >
      {icon || (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      )}
      <span className="sr-only">Toggle sidebar</span>
    </button>
  )
}

interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return <div className={cn("space-y-1", className)} {...props} />
}

interface SidebarMenuItemProps extends React.LiHTMLAttributes<HTMLLIElement> {}

export function SidebarMenuItem({ className, ...props }: SidebarMenuItemProps) {
  return <li className={cn("", className)} {...props} />
}

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
}

export function SidebarMenuButton({ className, isActive = false, ...props }: SidebarMenuButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "w-full text-left rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
        isActive && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20",
        className,
      )}
      {...props}
    />
  )
}

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroup({ className, ...props }: SidebarGroupProps) {
  return <div className={cn("", className)} {...props} />
}

interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroupLabel({ className, ...props }: SidebarGroupLabelProps) {
  const { isExpanded } = useSidebar()
  
  if (!isExpanded) {
    return null
  }
  
  return (
    <div className={cn("px-3 py-2 text-xs font-medium uppercase text-muted-foreground", className)} {...props} />
  )
}

interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroupContent({ className, ...props }: SidebarGroupContentProps) {
  return <div className={cn("", className)} {...props} />
} 