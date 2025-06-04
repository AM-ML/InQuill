"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Card, CardContent } from "../ui/card"

interface StatCounterProps {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
  color?: "blue" | "green" | "purple" | "amber" | "red"
  delay?: number
}

export function StatCounter({ value, label, description, icon, color = "blue", delay = 0 }: StatCounterProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [displayValue, setDisplayValue] = useState("0")

  const colorClasses = {
    blue: "from-blue-600 to-blue-400 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    green:
      "from-green-600 to-green-400 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    purple:
      "from-purple-600 to-purple-400 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    amber:
      "from-amber-600 to-amber-400 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
    red: "from-red-600 to-red-400 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  }

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        // Extract number from value string
        const numericValue = Number.parseInt(value.replace(/[^\d]/g, ""))
        if (!isNaN(numericValue)) {
          let current = 0
          const increment = numericValue / 50
          const timer = setInterval(() => {
            current += increment
            if (current >= numericValue) {
              setDisplayValue(value)
              clearInterval(timer)
            } else {
              const suffix = value.replace(/[\d,]/g, "")
              setDisplayValue(Math.floor(current).toLocaleString() + suffix)
            }
          }, 30)
        } else {
          setDisplayValue(value)
        }
      }, delay * 1000)

      return () => clearTimeout(timer)
    }
  }, [isInView, value, delay])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="h-full"
    >
      <Card className={`overflow-hidden border-2 transition-all duration-300 hover:shadow-lg ${colorClasses[color]}`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            {icon && (
              <motion.div
                className={`p-3 rounded-full ${colorClasses[color]}`}
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.div>
            )}
            <div className="flex-1">
              <motion.div
                className={`text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${colorClasses[color]}`}
                key={displayValue}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {displayValue}
              </motion.div>
              <p className="text-sm font-medium text-foreground mt-1">{label}</p>
              {description && <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{description}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
