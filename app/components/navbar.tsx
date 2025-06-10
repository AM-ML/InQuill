"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion"
import { Search, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ModeToggle } from "./mode-toggle"
import { UserAvatar } from "./user-avatar"
import { NotificationDropdown } from "./ui/notification-dropdown"
import { cn } from "../lib/utils"
import { useTheme } from "./theme-provider"
import { useAuth } from "../lib/contexts/AuthContext"
import logo from "../../public/logo-dark-theme.svg"
import { Logo } from "./ui/logo"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0
    if (latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
  })

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
    setActiveDropdown(null)
  }, [location.pathname])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const aboutDropdown = [
    {
      name: "Our Mission",
      href: "/about/mission",
      description: "Learn about our purpose and vision for medical research",
    },
    {
      name: "Research Impact",
      href: "/about/impact",
      description: "Discover how our work is changing healthcare globally",
    },
    {
      name: "Leadership & Team",
      href: "/about/team",
      description: "Meet the experts behind our groundbreaking research",
    },
    {
      name: "Global Collaborations",
      href: "/about/collaborations",
      description: "Explore our partnerships with institutions worldwide",
    },
  ]

  const navItems = [
    { name: "Home", href: "/" },
    { 
      name: "About", 
      href: "/about",
      dropdown: aboutDropdown
    },
    { name: "Articles", href: "/articles" },
    { name: "Research", href: "/research" },
    { name: "Contact", href: "/contact" },
  ]
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/articles?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
    }
  }
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e)
    }
  }

  const handleDropdownToggle = (e: React.MouseEvent, name: string) => {
    e.stopPropagation()
    setActiveDropdown(activeDropdown === name ? null : name)
  }

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
          <Logo 
            size="md" 
            color_when_light="primary" 
            showText 
            textSize="lg" 
            textGradient
          />
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div>
                    <button
                      onClick={(e) => handleDropdownToggle(e, item.name)}
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      className={cn(
                        "flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary",
                        activeDropdown === item.name 
                          ? "text-primary" 
                          : location.pathname.startsWith(item.href)
                          ? "text-primary"
                          : "text-muted-foreground",
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
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 mt-2 w-80 rounded-lg bg-background shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
                          onMouseLeave={() => setActiveDropdown(null)}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="py-2">
                            {item.dropdown.map((dropdownItem, index) => (
                              <Link key={dropdownItem.name} to={dropdownItem.href}>
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.2, delay: index * 0.05 }}
                                  whileHover={{
                                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                                    x: 5,
                                  }}
                                  className={cn(
                                    "px-4 py-3 border-l-2 border-transparent transition-all duration-200",
                                    location.pathname === dropdownItem.href
                                      ? "bg-blue-50 dark:bg-blue-900/20 border-l-blue-500 dark:border-l-blue-400 text-blue-600 dark:text-blue-400"
                                      : "text-gray-700 dark:text-gray-300 hover:border-l-blue-300",
                                  )}
                                >
                                  <div className="font-medium">{dropdownItem.name}</div>
                                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                    {dropdownItem.description}
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
                      "text-sm font-medium transition-colors hover:text-primary relative",
                      location.pathname === item.href ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                    {location.pathname === item.href && (
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                        layoutId="activeTab"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <form onSubmit={handleSearch} className="relative w-40 lg:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search articles..." 
              className="pl-8 h-9"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
          </form>

          <ModeToggle />
          
          {user && <NotificationDropdown />}
          
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
      <AnimatePresence>
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
                <img src={logo} alt="InQuill Logo" className="w-8 h-8" />
                <span className="font-bold text-xl">InQuill</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <motion.div
              className="container grid gap-6 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search articles..." 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                />
              </form>
              <nav className="grid gap-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  >
                    {item.dropdown ? (
                      <div className="space-y-2">
                        <button
                          onClick={(e) => handleDropdownToggle(e, item.name)}
                          className="flex items-center justify-between w-full text-left text-lg font-medium"
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
                              {item.dropdown.map((dropdownItem, subIndex) => (
                                <motion.div
                                  key={dropdownItem.name}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.2, delay: subIndex * 0.05 }}
                                >
                                  <Link
                                    to={dropdownItem.href}
                                    className={cn(
                                      "block py-2 text-sm",
                                      location.pathname === dropdownItem.href
                                        ? "text-blue-600 dark:text-blue-400 font-medium"
                                        : "text-muted-foreground",
                                    )}
                                    onClick={() => setIsOpen(false)}
                                  >
                                    <div className="font-medium">{dropdownItem.name}</div>
                                    <p className="text-xs text-muted-foreground mt-1">{dropdownItem.description}</p>
                                  </Link>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className={cn(
                          "text-lg font-medium transition-colors hover:text-primary",
                          location.pathname === item.href ? "text-primary" : "text-muted-foreground"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </motion.div>
                ))}
                {user && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + navItems.length * 0.05 }}
                  >
                    <NotificationDropdown />
                  </motion.div>
                )}
                <div onClick={() => setIsOpen(false)}>
                  <UserAvatar />
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
} 