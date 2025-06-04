"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

interface PageHeroProps {
  title: string
  subtitle: string
  backgroundClass?: string
  children?: React.ReactNode
}

export function PageHero({ title, subtitle, backgroundClass, children }: PageHeroProps) {
  const titleWords = title.split(" ")

  return (
    <section
      className={cn(
        "relative py-20 md:py-28 overflow-hidden",
        backgroundClass || "bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950",
      )}
    >
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/5 dark:from-blue-900/20 dark:to-purple-900/10"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
              {titleWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                  className="inline-block mr-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400"
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>
          </motion.div>

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
