"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent } from "../ui/card"
import { cn } from "../../lib/utils"

interface StatCardProps {
  value: string
  label: string
  icon?: React.ReactNode
  color?: string
  delay?: number
}

export function StatCard({ value, label, icon, color = "blue", delay = 0 }: StatCardProps) {
  const colorClasses = {
    blue: "from-blue-600 to-blue-400 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
    green: "from-green-600 to-green-400 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
    purple: "from-purple-600 to-purple-400 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20",
    amber: "from-amber-600 to-amber-400 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
    red: "from-red-600 to-red-400 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: delay }}
    >
      <Card className="overflow-hidden border-t-4 border-t-transparent hover:border-t-blue-500 transition-all duration-300 hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            {icon && (
              <div className={cn("p-3 rounded-full", colorClasses[color as keyof typeof colorClasses])}>{icon}</div>
            )}
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: delay + 0.2 }}
                className={cn(
                  "text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r",
                  colorClasses[color as keyof typeof colorClasses],
                )}
              >
                {value}
              </motion.div>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
