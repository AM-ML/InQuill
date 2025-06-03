"use client"

import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { Link } from "react-router-dom"

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 -z-10"></div>
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div
            className="flex flex-col justify-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <motion.h1
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                Advancing Medical Research Through Knowledge
              </motion.h1>
              <motion.p
                className="max-w-[600px] text-muted-foreground md:text-xl dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.7 }}
              >
                Discover the latest breakthroughs in medical science, access peer-reviewed research, and join a
                community dedicated to improving healthcare outcomes.
              </motion.p>
            </div>
            <motion.div
              className="flex flex-col gap-2 min-[400px]:flex-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              <Button
                className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
              >
                <Link to="/articles">Browse Articles</Link>
              </Button>
              <Button variant="outline">
                <Link to="/research">Latest Research</Link>
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <div className="relative h-[350px] w-[350px] md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute inset-4 bg-white dark:bg-gray-900 rounded-full shadow-xl"></div>
              <div className="absolute inset-8 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-full shadow-inner flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">10k+</div>
                  <div className="text-lg text-muted-foreground mt-2">Research Articles</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 