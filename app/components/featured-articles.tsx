"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ArticleCard from "./article-card"
import { articleService } from "../lib/services/articleService"
import { Loader2 } from "lucide-react"

export default function FeaturedArticles() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        setLoading(true)
        const response = await articleService.getArticles({
          limit: 3,
          sort: "popular", // Assuming there's a sort parameter for popular/featured articles
        })
        setArticles(response.articles)
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch featured articles:", err)
        setError("Failed to load featured articles")
        setLoading(false)
      }
    }

    fetchFeaturedArticles()
  }, [])

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block rounded-lg bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm text-blue-600 dark:text-blue-400">
            Featured Research
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Latest Medical Breakthroughs</h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Explore cutting-edge research and discoveries from leading medical institutions around the world.
          </p>
        </motion.div>
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <p className="text-red-500">{error}</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <p className="text-muted-foreground">No featured articles available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <ArticleCard key={article._id} article={article} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
} 