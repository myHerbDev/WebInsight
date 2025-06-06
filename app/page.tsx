"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GoogleHeroSection } from "@/components/google-hero-section"
import { ResultsSection } from "@/components/results-section"
import { EnhancedErrorMessage } from "@/components/enhanced-error-message"
import { Footer } from "@/components/footer"
import { UserProfileButton } from "@/components/user-profile-button"
import { LoadingAnimation } from "@/components/loading-animation"
import { Brain } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { WebsiteData } from "@/types/website-data"

export default function Home() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<WebsiteData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showFeatures, setShowFeatures] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if there's stored analysis data
    const storedData = localStorage.getItem("latest-website-analysis")
    if (storedData) {
      try {
        setAnalysisData(JSON.parse(storedData))
      } catch (e) {
        console.error("Failed to parse stored analysis data")
      }
    }
  }, [])

  const handleAnalyze = async (inputUrl: string) => {
    console.log("🚀 Starting analysis for:", inputUrl)
    setIsAnalyzing(true)
    setError(null)
    setAnalysisData(null)

    try {
      // Validate URL format
      let normalizedUrl = inputUrl.trim()
      if (!normalizedUrl) {
        throw new Error("Please enter a valid URL")
      }

      // Add protocol if missing
      if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
        normalizedUrl = "https://" + normalizedUrl
      }

      // Validate URL format
      try {
        new URL(normalizedUrl)
      } catch (urlError) {
        throw new Error("Please enter a valid URL format")
      }

      console.log("📤 Sending request to /api/analyze")

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: normalizedUrl }),
      })

      console.log("📥 Response status:", response.status)

      if (!response.ok) {
        let errorMessage = `Analysis failed with status ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          console.warn("Could not parse error response")
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("✅ Analysis completed successfully")

      // Validate response data
      if (!data || typeof data !== "object") {
        throw new Error("Invalid response format from server")
      }

      setAnalysisData(data)

      // Store in localStorage for persistence
      try {
        localStorage.setItem("latest-website-analysis", JSON.stringify(data))
      } catch (storageError) {
        console.warn("Could not save to localStorage:", storageError)
      }
    } catch (err: any) {
      console.error("💥 Analysis error:", err)
      const errorMessage = err?.message || "An unexpected error occurred during analysis"
      setError(errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleClear = () => {
    setAnalysisData(null)
    setError(null)
    localStorage.removeItem("latest-website-analysis")
  }

  const handleRetry = () => {
    setError(null)
    // Could implement retry with last URL if needed
  }

  const handleReset = () => {
    setAnalysisData(null)
    setError(null)
    setIsAnalyzing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 right-0 z-50 p-6"
      >
        <UserProfileButton />
      </motion.header>

      {/* Main Content */}
      <main className="relative">
        <AnimatePresence mode="wait">
          {!analysisData && !isAnalyzing && !error && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <GoogleHeroSection onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="min-h-screen flex items-center justify-center"
            >
              <LoadingAnimation />
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-screen flex items-center justify-center p-6"
            >
              <div className="max-w-2xl w-full">
                <EnhancedErrorMessage error={error} onRetry={handleRetry} onReset={handleReset} />
              </div>
            </motion.div>
          )}

          {analysisData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="min-h-screen"
            >
              <div className="container mx-auto px-6 py-12">
                {/* Back to Search Button */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
                  <button onClick={handleReset} className="google-button-secondary text-sm">
                    ← New Analysis
                  </button>
                </motion.div>

                <ResultsSection data={analysisData} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating AI Content Button */}
      {analysisData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={() => {
              // Save current analysis to localStorage
              try {
                localStorage.setItem("latest-website-analysis", JSON.stringify(analysisData))
                window.open("/ai-content", "_blank")
              } catch (error) {
                console.warn("Could not save analysis data:", error)
                window.open("/ai-content", "_blank")
              }
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full p-4"
            size="lg"
          >
            <Brain className="w-5 h-5 mr-2" />
            Generate AI Content
          </Button>
        </motion.div>
      )}

      {/* Footer - only show when not in hero mode */}
      <AnimatePresence>
        {(analysisData || error) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6">
        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 w-12 h-12 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
      </CardContent>
    </Card>
  )
}
