"use client"

import React, { createContext, useContext, useState } from "react"
import { cn } from "../../lib/utils"

interface CollapsibleContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CollapsibleContext = createContext<CollapsibleContextType | undefined>(undefined)

function useCollapsibleContext() {
  const context = useContext(CollapsibleContext)
  if (!context) {
    throw new Error("useCollapsibleContext must be used within a Collapsible")
  }
  return context
}

interface CollapsibleProps {
  children: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

export function Collapsible({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange: controlledOnOpenChange,
  className,
  ...props
}: CollapsibleProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
  const onOpenChange = controlledOnOpenChange || setUncontrolledOpen
  
  return (
    <CollapsibleContext.Provider value={{ open, onOpenChange }}>
      <div className={cn("", className)} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
}

interface CollapsibleTriggerProps {
  children: React.ReactNode
  asChild?: boolean
  className?: string
}

export function CollapsibleTrigger({ 
  children,
  asChild = false,
  className,
  ...props
}: CollapsibleTriggerProps & React.HTMLAttributes<HTMLButtonElement>) {
  const { open, onOpenChange } = useCollapsibleContext()
  
  return (
    <button
      type="button"
      className={cn("", className)}
      onClick={() => onOpenChange(!open)}
      {...props}
    >
      {children}
    </button>
  )
}

interface CollapsibleContentProps {
  children: React.ReactNode
  className?: string
}

export function CollapsibleContent({
  children,
  className,
  ...props
}: CollapsibleContentProps & React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useCollapsibleContext()
  
  if (!open) return null
  
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  )
} 