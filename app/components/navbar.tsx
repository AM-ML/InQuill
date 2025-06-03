"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { Search, Menu, X } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ModeToggle } from "./mode-toggle"
import { UserAvatar } from "./user-avatar"
import { cn } from "../lib/utils"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const location = useLocation()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0
    if (latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
  })

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Articles", href: "/articles" },
    { name: "Research", href: "/research" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all",
        hidden ? "-translate-y-full" : "translate-y-0",
      )}
      initial={{ y: 0 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-md w-8 h-8"></div>
          <span className="font-bold text-xl">MedResearch</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  "text-primary"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="relative w-40 lg:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8 h-9" />
          </div>

          <ModeToggle />
          
          <UserAvatar />
        </div>

        <div className="flex md:hidden items-center space-x-4">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-background md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-md w-8 h-8"></div>
              <span className="font-bold text-xl">MedResearch</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <div className="container grid gap-6 p-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-8" />
            </div>
            <nav className="grid gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                  "text-primary"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div onClick={() => setIsOpen(false)}>
                <UserAvatar />
              </div>
            </nav>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
} 