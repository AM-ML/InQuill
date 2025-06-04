"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Menu, X } from "lucide-react"
import { cn } from "./lib/utils"
import { Button } from "./components/ui/button"
import { ModeToggle } from "./components/mode-toggle"
import { useMediaQuery } from "./hooks/use-media-query"
import { Logo } from "./components/ui/logo"

export function MainNav() {
  const pathname = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const navItems = [
    { name: "Home", href: "/" },
    {
      name: "About Us",
      href: "#",
      dropdown: [
        { name: "Our Mission", href: "/about/mission" },
        { name: "Research Impact", href: "/about/impact" },
        { name: "Leadership & Team", href: "/about/team" },
        { name: "Global Collaborations", href: "/about/collaborations" },
      ],
    },
    { name: "Articles", href: "/articles" },
    { name: "Research", href: "/research" },
    { name: "Contact", href: "/contact" },
  ]

  const handleDropdownToggle = (e: React.MouseEvent, name: string) => {
    e.stopPropagation()
    setActiveDropdown(activeDropdown === name ? null : name)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md dark:bg-gray-950/90 border-gray-200 dark:border-gray-800"
          : "bg-white dark:bg-gray-950 border-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <Logo 
            size="md" 
            color_when_light="black"
            showText
            textSize="lg" 
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div>
                    <button
                      onClick={(e) => handleDropdownToggle(e, item.name)}
                      className={cn(
                        "flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary",
                        activeDropdown === item.name ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      <span>{item.name}</span>
                      <motion.div
                        animate={{ rotate: activeDropdown === item.name ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 mt-2 w-64 rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="py-1">
                            {item.dropdown.map((dropdownItem) => (
                              <Link key={dropdownItem.name} to={dropdownItem.href} className="block">
                                <motion.div
                                  whileHover={{
                                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                                    x: 5,
                                  }}
                                  className={cn(
                                    "px-4 py-3 text-sm border-l-2 border-transparent",
                                    pathname.pathname === dropdownItem.href
                                      ? "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                                      : "text-gray-700 dark:text-gray-300",
                                  )}
                                >
                                  <div className="font-medium">{dropdownItem.name}</div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {getDropdownDescription(dropdownItem.name)}
                                  </p>
                                </motion.div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname.pathname === item.href ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <ModeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center space-x-2">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-800"
          >
            <div className="container py-4 px-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="space-y-4">
                {navItems.map((item) => (
                  <div key={item.name} className="space-y-2">
                    {item.dropdown ? (
                      <>
                        <button
                          onClick={(e) => handleDropdownToggle(e, item.name)}
                          className="flex items-center justify-between w-full text-left text-base font-medium"
                        >
                          <span>{item.name}</span>
                          <motion.div
                            animate={{ rotate: activeDropdown === item.name ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {activeDropdown === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pl-4 space-y-2 border-l-2 border-gray-200 dark:border-gray-700"
                            >
                              {item.dropdown.map((dropdownItem) => (
                                <Link
                                  key={dropdownItem.name}
                                  to={dropdownItem.href}
                                  className={cn(
                                    "block py-2 text-sm",
                                    pathname.pathname === dropdownItem.href
                                      ? "text-blue-600 dark:text-blue-400 font-medium"
                                      : "text-muted-foreground",
                                  )}
                                >
                                  {dropdownItem.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={item.href}
                        className={cn(
                          "block text-base font-medium",
                          pathname.pathname === item.href ? "text-primary" : "text-muted-foreground",
                        )}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function getDropdownDescription(name: string): string {
  switch (name) {
    case "Our Mission":
      return "Learn about our purpose and vision for medical research"
    case "Research Impact":
      return "Discover how our work is changing healthcare globally"
    case "Leadership & Team":
      return "Meet the experts behind our groundbreaking research"
    case "Global Collaborations":
      return "Explore our partnerships with institutions worldwide"
    default:
      return ""
  }
}
