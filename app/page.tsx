"use client"

import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { toast } from "@/components/ui/use-toast"
import type { WebsiteData, AnalysisOptions } from "@/types/website-data"
import { safeFetch } from "@/lib/safe-fetch"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<"url" | "access" | "timeout" | "server" | "unknown">("unknown")
  const [lastAnalyzedUrl, setLastAnalyzedUrl] = useState<string>("")
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [activeTab, setActiveTab] = useState("analyze")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true) // Ensures client-side logic runs after hydration
  }, [])

  useEffect(() => {
    if (!isClient) return

    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isClient])

  const determineErrorType = (
    errorMsg: string,
    statusCode?: number,
  ): "url" | "access" | "timeout" | "server" | "unknown" => {
    const lowerErrorMsg = errorMsg.toLowerCase()
    if (lowerErrorMsg.includes("invalid url") || lowerErrorMsg.includes("url format")) return "url"
    if (lowerErrorMsg.includes("access denied") || lowerErrorMsg.includes("403") || statusCode === 403) return "access"
    if (lowerErrorMsg.includes("timeout") || lowerErrorMsg.includes("timed out") || statusCode === 408) return "timeout"
    if (lowerErrorMsg.includes("server error") || statusCode === 500 || statusCode === 503) return "server"
    return "unknown"
  }

  const handleAnalyzeWebsite = async (url: string) => {
    if (!isClient) return

    setIsLoading(true)
    setWebsiteData(null)
    setError(null)
    setLastAnalyzedUrl(url)
    setActiveTab("analyze") // Keep on analyze tab while loading

    try {
      let normalizedUrl = url.trim()
      if (!normalizedUrl) throw new Error("URL cannot be empty.")
      if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
        normalizedUrl = `https://${normalizedUrl}`
      }
      new URL(normalizedUrl) // Validate URL format

      const analysisOptions: AnalysisOptions = {
        includeAdvancedMetrics: true,
        analyzeSEO: true,
        checkAccessibility: true,
        analyzePerformance: true,
        checkSecurity: true,
        analyzeSustainability: true,
        includeContentAnalysis: true,
        checkMobileOptimization: true,
        analyzeLoadingSpeed: true,
        checkSocialMedia: true,
      }

      const {
        success,
        data,
        error: fetchError,
        status,
      } = await safeFetch<WebsiteData>("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalizedUrl, ...analysisOptions }),
        timeout: 45000, // 45 seconds timeout for analysis
      })

      if (!success || !data) {
        const determinedErrorType = determineErrorType(fetchError || "Analysis failed", status)
        setErrorType(determinedErrorType)
        throw new Error(fetchError || "Analysis failed due to an unknown error.")
      }

      // Basic validation of received data
      if (!data._id || !data.url) {
        throw new Error("Received incomplete analysis data from server.")
      }

      setWebsiteData(data)
      toast({ title: "Analysis Complete!", description: `Successfully analyzed ${data.url}` })
      setTimeout(() => setActiveTab("results"), 300) // Switch to results tab
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred during analysis."
      setError(errorMessage)
      if (errorType === "unknown") {
        // Set error type if not already set by safeFetch
        setErrorType(determineErrorType(errorMessage))
      }
      toast({ title: "Analysis Failed", description: errorMessage, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAnalysis = async (type: "save" | "favorite") => {
    // This function would require authentication.
    // For now, it will just show a toast.
    if (!websiteData) return
    toast({
      title: "Feature Coming Soon",
      description: `${type === "favorite" ? "Favoriting" : "Saving"} analyses will be available with user accounts.`,
    })
  }

  const handleSignUpClick = () => {
    toast({
      title: "Feature Coming Soon",
      description: "User accounts and sign-up functionality will be available soon.",
    })
  }

  const handleRetryAnalysis = () => {
    if (lastAnalyzedUrl) handleAnalyzeWebsite(lastAnalyzedUrl)
  }

  const handleResetAnalysis = () => {
    setError(null)
    setWebsiteData(null)
    setLastAnalyzedUrl("")
    setActiveTab("analyze")
  }

  const scrollToTop = () => {
    if (isClient) window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!isClient) {
    // Basic SSR fallback / pre-hydration view
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">Welcome to WebInSight</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          We are currently performing an essential check. Please wait a moment.
        </p>
        <div className="mt-8 p-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you see this message, the basic page structure is loading correctly. The ServiceWorker issue might be
            related to more complex components or client-side logic that was previously on this page.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
