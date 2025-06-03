import React from "react"
import { Outlet } from "react-router-dom"
import Navbar from "./navbar"
import Footer from "./footer"
import { ThemeProvider } from "./theme-provider"

// Check if we're in development mode
const isDev = process.env.NODE_ENV === "development";

export default function RootLayout() {
  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
} 