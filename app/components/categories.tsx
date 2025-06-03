"use client"

import { motion } from "framer-motion"
import { Heart, Brain, Microscope, Dna, Stethoscope, Bug } from "lucide-react"
import { Link } from "react-router-dom"

const categories = [
  {
    name: "Cardiology",
    icon: Heart,
    description: "Research on heart diseases, treatments, and prevention strategies.",
    color: "bg-red-500",
    href: "/categories/cardiology",
  },
  {
    name: "Neurology",
    icon: Brain,
    description: "Studies on the nervous system, brain disorders, and neurological conditions.",
    color: "bg-purple-500",
    href: "/categories/neurology",
  },
  {
    name: "Immunology",
    icon: Microscope,
    description: "Research on immune system function, autoimmune diseases, and immunotherapies.",
    color: "bg-green-500",
    href: "/categories/immunology",
  },
  {
    name: "Genetics",
    icon: Dna,
    description: "Studies on genes, genetic disorders, and gene-based therapies.",
    color: "bg-blue-500",
    href: "/categories/genetics",
  },
  {
    name: "General Medicine",
    icon: Stethoscope,
    description: "Broad medical research covering various aspects of health and disease.",
    color: "bg-amber-500",
    href: "/categories/general",
  },
  {
    name: "Microbiology",
    icon: Bug,
    description: "Research on microorganisms, infectious diseases, and antimicrobial strategies.",
    color: "bg-emerald-500",
    href: "/categories/microbiology",
  },
]

export default function Categories() {
  return (
    <section className="py-16 bg-slate-50 dark:bg-gray-900/30">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Research Categories</h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Explore our extensive collection of medical research organized by specialty.
          </p>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.name}
              category={category}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoryCard({ category, index }: { category: any; index: number }) {
  const IconComponent = category.icon
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-blue-900/5 overflow-hidden hover:shadow-lg transition-all"
    >
      <Link to={category.href} className="block p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`p-3 rounded-full ${category.color} bg-opacity-20 dark:bg-opacity-30`}>
            <IconComponent className={`h-8 w-8 text-${category.color.split('-')[1]}-600 dark:text-${category.color.split('-')[1]}-400`} />
          </div>
          <h3 className="text-xl font-bold">{category.name}</h3>
          <p className="text-sm text-muted-foreground">{category.description}</p>
          <div className="pt-2 text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center space-x-1">
            <span>Browse articles</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
} 