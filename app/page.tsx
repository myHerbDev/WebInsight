"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ResultsSection } from "@/components/results-section"
import { SignUpModal } from "@/components/sign-up-modal"
import { toast } from "@/components/ui/use-toast"
import type { WebsiteData, AnalysisOptions } from "@/types/website-data" // Ensure AnalysisOptions is imported
import { AlertCircle, Search, Globe, Zap, Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoadingAnimation } from "@/components/loading-animation"
import { Logo } from "@/components/logo"
import { safeFetch } from "@/lib/safe-fetch" // Ensure safeFetch is imported

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [url, setUrl] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleAnalyzeWebsite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isClient || !url.trim()) return

    let formattedUrl = url.trim()
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`
    }

    setIsLoading(true)
    setWebsiteData(null)
    setError(null)

    try {
      const analysisOptions: AnalysisOptions = {
        // Define analysis options
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
      } = await safeFetch<WebsiteData>("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formattedUrl, ...analysisOptions }), // Pass options
        timeout: 45000,
      })

      if (!success || !data) {
        throw new Error(fetchError || "Analysis failed due to an unknown error.")
      }
      if (!data._id || !data.url) {
        throw new Error("Received incomplete analysis data from server.")
      }

      setWebsiteData(data)
      toast({ title: "Analysis Complete!", description: `Successfully analyzed ${data.url}` })
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred during analysis."
      setError(errorMessage)
      toast({ title: "Analysis Failed", description: errorMessage, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAnalysis = async (type: "save" | "favorite") => {
    if (!websiteData) return
    toast({
      title: "Feature Coming Soon",
      description: `${type === "favorite" ? "Favoriting" : "Saving"} analyses will be available with user accounts.`,
    })
  }

  const handleSignUp = (tempUserId?: string) => {
    if (tempUserId) setUserId(tempUserId)
    setShowSignUpModal(true)
  }

  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col futuristic-bg">
        <div className="grid-pattern"></div>
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-20 relative z-10">
          <div className="text-center">
            <LoadingAnimation />
            <p className="text-xl mt-4">Initializing WebInSight...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col futuristic-bg">
      {/* Background elements */}
      <div className="grid-pattern"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-20 relative z-10">
        <div className="w-full max-w-3xl text-center mb-12">
          {/* Futuristic logo */}
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            Discover Your Website's
            <span className="gradient-text block mt-2" data-text="Full Potential">
              Full Potential
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            AI-powered analysis for performance, SEO, and sustainability optimization
          </p>

          {/* Futuristic search form */}
          <form onSubmit={handleAnalyzeWebsite} className="relative mb-12 max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-xl -z-10"></div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., example.com)"
              className="futuristic-input w-full pr-16"
              aria-label="Website URL"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 futuristic-button h-12 w-12 flex items-center justify-center p-0"
              aria-label="Analyze Website"
              disabled={!url.trim() || isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Search className="h-5 w-5 text-white" />
              )}
            </button>
          </form>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Performance",
                description: "Analyze loading speed, core web vitals & user experience metrics",
                gradient: "from-blue-500 to-cyan-400",
              },
              {
                icon: Globe,
                title: "SEO",
                description: "Discover optimization opportunities to improve search rankings",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: Shield,
                title: "Sustainability",
                description: "Measure environmental impact and find greener alternatives",
                gradient: "from-green-500 to-emerald-400",
              },
            ].map((feature, i) => (
              <div key={i} className="futuristic-card p-6 group">
                <div className="mb-4 relative">
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${feature.gradient} opacity-20 blur-lg group-hover:opacity-30 transition-opacity`}
                  ></div>
                  <div
                    className={`h-12 w-12 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Results Section */}
        <div className="w-full max-w-4xl">
          {isLoading && !websiteData && <LoadingAnimation />}
          {error && !isLoading && (
            <Alert variant="destructive" className="shadow-lg rounded-xl p-6 futuristic-card">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="font-semibold">Analysis Failed</AlertTitle>
              <AlertDescription>{error} Please check the URL or try a different website.</AlertDescription>
            </Alert>
          )}
          {websiteData && !isLoading && (
            <div className="mt-0">
              <ResultsSection
                data={websiteData}
                onSignUpClick={handleSignUp}
                onSave={() => handleSaveAnalysis("save")}
                onFavorite={() => handleSaveAnalysis("favorite")}
                userId={userId}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />

      {showSignUpModal && (
        <SignUpModal
          onClose={() => setShowSignUpModal(false)}
          tempUserId={userId}
          onSignUpSuccess={(newUserId) => {
            setUserId(newUserId)
            setShowSignUpModal(false)
            toast({ title: "Account Created", description: "You've successfully signed up!" })
          }}
        />
      )}
    </div>
  )
}
