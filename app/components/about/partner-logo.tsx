"use client"

import { motion } from "framer-motion"

interface PartnerLogoProps {
  name: string
  logo: string
  index?: number
}

export function PartnerLogo({ name, logo, index = 0 }: PartnerLogoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
    >
      <img
        src={logo || "https://via.placeholder.com/120x60?text=Logo"}
        alt={name}
        className="max-h-12 w-auto object-contain filter dark:invert-[0.85]"
      />
    </motion.div>
  )
}
