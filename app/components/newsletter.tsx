"use client"

import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useState } from "react"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<null | "success" | "error">(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // In a real application, you would send this to your backend
    if (email && email.includes("@")) {
      setStatus("success")
      setEmail("")
    } else {
      setStatus("error")
    }

    // Reset status after 3 seconds
    setTimeout(() => setStatus(null), 3000)
  }

  return (
    <section className="py-16 md:py-24 bg-blue-50 dark:bg-blue-950/20">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <motion.div
            className="flex flex-col justify-center space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Stay Updated with the Latest Research
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Subscribe to our newsletter and receive the latest medical breakthroughs, research papers, and expert opinions directly in your inbox.
              </p>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center">
                <svg
                  className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="m5 12 5 5L20 7" />
                </svg>
                Weekly curated research summaries
              </li>
              <li className="flex items-center">
                <svg
                  className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="m5 12 5 5L20 7" />
                </svg>
                Early access to new research papers
              </li>
              <li className="flex items-center">
                <svg
                  className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="m5 12 5 5L20 7" />
                </svg>
                Exclusive interviews with medical experts
              </li>
            </ul>
          </motion.div>
          <motion.div
            className="flex flex-col space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="rounded-lg border bg-background p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Join 20,000+ healthcare professionals who receive our newsletter.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    className="w-full"
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {status === "error" && (
                  <p className="text-sm text-red-500">Please enter a valid email address.</p>
                )}
                {status === "success" && (
                  <p className="text-sm text-green-500">Thank you for subscribing!</p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
                >
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4">
                By subscribing, you agree to our{" "}
                <a href="#" className="text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 