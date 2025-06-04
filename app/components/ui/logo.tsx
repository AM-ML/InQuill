"use client"

import { useTheme } from "next-themes"
import { cn } from "../../lib/utils"
import { useEffect, useState } from "react"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  color_when_light?: "black" | "white" | "primary" | "accent"
  showText?: boolean
  textSize?: "sm" | "md" | "lg" | "xl"
  textGradient?: boolean
}

export function Logo({
  className,
  size = "md",
  color_when_light = "black",
  showText = false,
  textSize = "md",
  textGradient = false,
}: LogoProps) {
  const { theme, systemTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Determine color based on theme and color_when_light prop
  // Use resolvedTheme which correctly handles 'system' preference
  const isDark = mounted && resolvedTheme === "dark"
  
  const getLogoColor = () => {
    switch (color_when_light) {
      case "black":
        return isDark ? "white" : "black"
      case "white":
        return isDark ? "black" : "white"
      case "primary":
        return isDark ? "blue-400" : "blue-600"
      case "accent":
        return isDark ? "blue-400" : "blue-600"
      default:
        return isDark ? "white" : "black"
    }
  }
  
  // Size classes
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
    xl: "h-12 w-12"
  }
  
  // Text size classes
  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl"
  }
  
  const logoColor = getLogoColor()
  const logoColorClass = `text-${logoColor}`
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 288 280.4"
        className={cn(sizeClasses[size], logoColorClass)}
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g>
          {/* Top circle */}
          <circle cx="144" cy="47.76" r="39.08" />
          {/* Bottom left circle */}
          <circle cx="47.76" cy="232.63" r="39.08" />
          {/* Bottom right circle */}
          <circle cx="240.24" cy="232.63" r="39.08" />
          {/* Connecting lines */}
          <line x1="144" y1="47.76" x2="47.76" y2="232.63" />
          <line x1="144" y1="47.76" x2="240.24" y2="232.63" />
        </g>
      </svg>
      
      {showText && (
        <span 
          className={cn(
            "font-bold",
            textSizeClasses[textSize],
            textGradient 
              ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400" 
              : logoColorClass
          )}
        >
          InQuill
        </span>
      )}
    </div>
  )
}