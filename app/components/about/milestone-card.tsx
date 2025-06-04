"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"

interface MilestoneCardProps {
  year: string
  title: string
  description: string
  index?: number
}

export function MilestoneCard({ year, title, description, index = 0 }: MilestoneCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative"
    >
      {/* Timeline connector */}
      <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>

      <div className="flex gap-6">
        <div className="relative z-10">
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 border-4 border-white dark:border-gray-900 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-blue-600 dark:bg-blue-400"></div>
          </div>
        </div>

        <Card className="flex-1 mb-8 hover:shadow-md transition-all duration-300">
          <CardContent className="p-6">
            <Badge variant="outline" className="mb-2 font-mono">
              {year}
            </Badge>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
