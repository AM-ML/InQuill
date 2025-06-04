"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "../ui/card"
import { Linkedin, Twitter, Mail } from "lucide-react"
import { Button } from "../ui/button"

interface TeamCardProps {
  name: string
  title: string
  bio: string
  image: string
  socialLinks?: {
    linkedin?: string
    twitter?: string
    email?: string
  }
  index?: number
}

export function TeamCard({ name, title, bio, image, socialLinks, index = 0 }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden h-full hover:shadow-md transition-all duration-300">
        <CardContent className="p-0">
          <div className="aspect-square relative overflow-hidden rounded-t-lg">
            <motion.img
              src={image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
              alt={name}
              className="object-cover w-full h-full transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
            />
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-bold text-xl">{name}</h3>
              <p className="text-sm text-muted-foreground">{title}</p>
            </div>
            <p className="text-sm line-clamp-3">{bio}</p>

            {socialLinks && (
              <div className="flex space-x-2 pt-2">
                {socialLinks.linkedin && (
                  <Button variant="ghost" size="icon"  className="h-8 w-8">
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </a>
                  </Button>
                )}
                {socialLinks.twitter && (
                  <Button variant="ghost" size="icon"  className="h-8 w-8">
                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </a>
                  </Button>
                )}
                {socialLinks.email && (
                  <Button variant="ghost" size="icon"  className="h-8 w-8">
                    <a href={`mailto:${socialLinks.email}`}>
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Email</span>
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
