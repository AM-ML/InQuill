"use client"

import { motion } from "framer-motion"
import ArticleCard from "./article-card"

export default function FeaturedArticles() {
  const articles = [
    {
      id: "1",
      title: "New mRNA Vaccine Technology Shows Promise Against Multiple Diseases",
      description:
        "Researchers have developed a new mRNA vaccine platform that could potentially be used to create vaccines for a wide range of infectious diseases, including those that have historically been difficult to target.",
      category: "Vaccines",
      image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.crbgroup.com%2Fwp-content%2Fuploads%2F2021%2F03%2FVaccine-photo-2.jpg&f=1&nofb=1&ipt=72600763c019f90ecfcae4d05a6852ebf52944f8898e0b2831a9e029ef1fa6a1",
      date: "May 28, 2025",
      readTime: "8 min read",
      author: {
        name: "Dr. Sarah Chen",
        avatar: "",
      },
    },
    {
      id: "2",
      title: "Breakthrough in Alzheimer's Research Identifies New Biomarkers",
      description:
        "A large-scale study has identified several new biomarkers that may help detect Alzheimer's disease years before symptoms appear, potentially opening new avenues for early intervention and treatment.",
      category: "Neurology",
      image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.alzsd.org%2Fwp-content%2Fuploads%2F2018%2F10%2Flatest-in-alzheimers-research.jpg&f=1&nofb=1&ipt=a10264e559f8d214e46ffe8ba555097c5f3ba6cc6fc271a010ec0c58c94b962a",
      date: "May 25, 2025",
      readTime: "6 min read",
      author: {
        name: "Dr. Michael Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "3",
      title: "Artificial Intelligence System Outperforms Radiologists in Detecting Lung Cancer",
      description:
        "A new AI system developed by researchers has demonstrated superior accuracy in detecting early-stage lung cancer from CT scans compared to experienced radiologists, potentially improving survival rates through earlier diagnosis.",
      category: "AI in Medicine",
      image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fassets.hyscaler.com%2Fwp-content%2Fuploads-webpc%2Fuploads%2F2023%2F11%2Fai-healthcare.png.webp&f=1&nofb=1&ipt=ce8ffae9c4a2c728b72bf36d7a698dd47be03bcbdf37547ac78364081de46a7e",
      date: "May 22, 2025",
      readTime: "5 min read",
      author: {
        name: "Dr. Emily Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
  ]

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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
} 