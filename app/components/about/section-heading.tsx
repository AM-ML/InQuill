"use client"

import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

interface SectionHeadingProps {
  title: string
  subtitle?: string
  align?: "left" | "center" | "right"
  className?: string
}

export function SectionHeading({ title, subtitle, align = "left", className }: SectionHeadingProps) {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={cn("max-w-2xl mb-10", alignmentClasses[align], className)}
    >
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
    </motion.div>
  )
}
