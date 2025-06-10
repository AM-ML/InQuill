"use client"

import Link from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { AlertTriangle, Home, ArrowLeft } from "lucide-react"

export default function AdminNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 rounded-full flex items-center justify-center mb-4"
            >
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Page Not Found</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              The admin page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-6">
                This might happen if you've entered an incorrect URL or the page has been removed.
              </p>
            </div>
            <div className="flex flex-col space-y-3">
              <Button asChild className="w-full">
                <Link to="/admin">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin
                </Link>
              </Button>
            </div>
            <div className="text-center pt-4">
              <p className="text-xs text-muted-foreground">Need help? Contact the system administrator.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

