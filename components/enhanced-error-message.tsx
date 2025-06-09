"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, WifiOff, ServerCrash, FileWarning, RotateCcw, Home } from "lucide-react"

interface EnhancedErrorMessageProps {
  error: string
  errorType: "url" | "access" | "timeout" | "server" | "unknown"
  onRetry?: () => void
  onReset?: () => void
}

export function EnhancedErrorMessage({ error, errorType, onRetry, onReset }: EnhancedErrorMessageProps) {
  let Icon = AlertTriangle
  let title = "An Error Occurred"
  let suggestion = "Please try again. If the issue persists, contact support."

  switch (errorType) {
    case "url":
      Icon = FileWarning
      title = "Invalid URL"
      suggestion = "Please check the website address you entered and try again. Ensure it includes http:// or https://"
      break
    case "access":
      Icon = WifiOff // Or a lock icon
      title = "Access Denied or Network Issue"
      suggestion =
        "We couldn't access the website. It might be offline, blocking our analyzer, or there could be a network problem. Please check the URL and your connection."
      break
    case "timeout":
      Icon = WifiOff
      title = "Request Timed Out"
      suggestion =
        "The website took too long to respond. It might be temporarily unavailable or experiencing high traffic. Please try again later."
      break
    case "server":
      Icon = ServerCrash
      title = "Server Error"
      suggestion = "We encountered an issue on our end or with the website's server. Please try again in a few moments."
      break
    default:
      Icon = AlertTriangle
      title = "Oops! Something Went Wrong"
      suggestion = "An unexpected error occurred. We've logged it and will investigate. Please try again."
  }

  return (
    <div
      className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-300 p-6 rounded-md shadow-md"
      role="alert"
    >
      <div className="flex items-center mb-3">
        <Icon className="h-8 w-8 text-red-500 dark:text-red-600 mr-3 flex-shrink-0" />
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="mb-2 text-sm">{error}</p>
      <p className="mb-4 text-sm font-medium">{suggestion}</p>
      <div className="flex space-x-3">
        {onRetry && (
          <Button
            variant="outline"
            onClick={onRetry}
            className="border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-800/50 text-red-700 dark:text-red-300"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
        {onReset && (
          <Button
            variant="outline"
            onClick={onReset}
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
          >
            <Home className="mr-2 h-4 w-4" />
            Start New Analysis
          </Button>
        )}
      </div>
    </div>
  )
}
