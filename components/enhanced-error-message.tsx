"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, RefreshCw, ExternalLink, CheckCircle, XCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface EnhancedErrorMessageProps {
  error: string
  errorType?: "url" | "access" | "timeout" | "server" | "unknown"
  onRetry: () => void
  onReset: () => void
}

export function EnhancedErrorMessage({ error, errorType = "unknown", onRetry, onReset }: EnhancedErrorMessageProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [checkResults, setCheckResults] = useState<{ valid: boolean; message: string } | null>(null)

  // Map error types to specific guidance
  const errorInfo = {
    url: {
      title: "Invalid URL Format",
      description: "The URL you entered doesn't appear to be valid.",
      icon: <XCircle className="h-6 w-6 text-red-500" />,
      suggestions: [
        "Make sure the URL starts with http:// or https://",
        "Check for typos in the domain name",
        "Ensure there are no spaces in the URL",
        "Try removing any special characters",
      ],
    },
    access: {
      title: "Website Access Blocked",
      description: "The website may be blocking automated access or analysis tools.",
      icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
      suggestions: [
        "Verify the website is publicly accessible",
        "Check if the website uses anti-bot protection",
        "Try analyzing a different page from the same website",
        "The website might have security measures preventing analysis",
      ],
    },
    timeout: {
      title: "Analysis Timeout",
      description: "The analysis took too long to complete.",
      icon: <RefreshCw className="h-6 w-6 text-amber-500" />,
      suggestions: [
        "The website might be too large or complex",
        "Try again when the website's server might be less busy",
        "Check your internet connection",
        "Try analyzing a specific page rather than the entire site",
      ],
    },
    server: {
      title: "Server Error",
      description: "Our analysis server encountered an issue.",
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
      suggestions: [
        "This is likely a temporary issue on our end",
        "Please try again in a few minutes",
        "If the problem persists, our team has been notified",
        "Try analyzing a different website in the meantime",
      ],
    },
    unknown: {
      title: "Analysis Failed",
      description: "We couldn't complete the analysis of this website.",
      icon: <Info className="h-6 w-6 text-blue-500" />,
      suggestions: [
        "Check if the website is currently online",
        "Verify you've entered the correct URL",
        "Try again in a few moments",
        "The website might have features that interfere with our analysis tools",
      ],
    },
  }

  const currentError = errorInfo[errorType]

  const checkUrl = async () => {
    setIsChecking(true)
    setCheckResults(null)

    try {
      // Simple validation
      const urlString = error.match(/https?:\/\/[^\s]+/)?.[0] || ""

      if (!urlString) {
        setCheckResults({ valid: false, message: "No valid URL found in the error message." })
        setIsChecking(false)
        return
      }

      try {
        new URL(urlString)
        setCheckResults({
          valid: true,
          message: "The URL format appears to be valid. The issue might be with website access or our analysis tools.",
        })
      } catch (e) {
        setCheckResults({ valid: false, message: "The URL format is invalid. Please check for typos." })
      }
    } catch (e) {
      setCheckResults({ valid: false, message: "Couldn't verify the URL. Please check it manually." })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
    >
      <div className="bg-red-50 dark:bg-red-900/30 px-6 py-4 border-b border-red-100 dark:border-red-800">
        <div className="flex items-center space-x-3">
          {currentError.icon}
          <div>
            <h3 className="font-semibold text-lg text-red-800 dark:text-red-300">{currentError.title}</h3>
            <p className="text-red-600 dark:text-red-400">{currentError.description}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Alert variant="destructive" className="bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
          <AlertTitle className="font-medium">Error Details</AlertTitle>
          <AlertDescription className="mt-2 text-sm">{error}</AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Possible Causes & Solutions</h4>

          <ul className="space-y-2">
            {currentError.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="mt-1 text-green-500 dark:text-green-400 flex-shrink-0">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        <Accordion type="single" collapsible className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <AccordionItem value="troubleshooting">
            <AccordionTrigger className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              Advanced Troubleshooting
            </AccordionTrigger>
            <AccordionContent className="space-y-4 text-sm">
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  If you continue to experience issues, try these additional steps:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                  <li>Clear your browser cache and cookies</li>
                  <li>Try using a different browser</li>
                  <li>Check if the website requires authentication</li>
                  <li>Verify the website isn't experiencing downtime</li>
                  <li>Try analyzing a specific page rather than the homepage</li>
                </ul>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={checkUrl}
                  disabled={isChecking}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20"
                >
                  {isChecking ? "Checking..." : "Check URL Format"}
                </Button>

                {checkResults && (
                  <div
                    className={`mt-3 p-3 text-sm rounded-md ${
                      checkResults.valid
                        ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                        : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                    }`}
                  >
                    {checkResults.message}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700 text-white">
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>

          <Button variant="outline" onClick={onReset} className="border-gray-300 dark:border-gray-600">
            Analyze Different Website
          </Button>

          <a
            href="https://docs.example.com/troubleshooting"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            View Help Docs <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}
