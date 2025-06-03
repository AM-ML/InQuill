"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Link } from "react-router-dom"

interface ArticleCardProps {
  article: {
    id: string
    title: string
    description: string
    category: string
    image: string
    date: string
    readTime: string
    author: {
      name: string
      avatar: string
    }
  }
  index?: number
}

export default function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link to={`/articles/${article.id}`} className="h-full">
        <Card className="overflow-hidden h-full transition-all hover:shadow-md dark:hover:shadow-blue-900/10">
          <div className="aspect-video relative overflow-hidden">
            <img 
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500">
                {article.category}
              </Badge>
            </div>
          </div>
          <CardHeader className="p-4">
            <h3 className="text-xl font-bold line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {article.title}
            </h3>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-muted-foreground line-clamp-3 text-sm">{article.description}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex flex-col space-y-4">
            <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{article.readTime}</span>
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
                  <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{article.author.name}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
} 