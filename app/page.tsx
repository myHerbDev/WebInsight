"use client"

import { useState } from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ResultsSection } from "@/components/results-section"
import { SignUpModal } from "@/components/sign-up-modal"
import { toast } from "@/components/ui/use-toast"
import type { WebsiteData } from "@/types/website-data"
import { AlertCircle, Sparkles } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { WebsiteForm } from "@/components/website-form"
import { LoadingAnimation } from "@/components/loading-animation"
import { SustainabilityQuote } from "@/components/sustainability-quote"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyzeWebsite = async (url: string) => {
    setIsLoading(true)
    setWebsiteData(null)
    setError(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || data.message || "Failed to analyze website")
      setWebsiteData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."
      console.error("Error analyzing website:", err)
      setError(errorMessage)
      toast({ title: "Analysis Error", description: errorMessage, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveAnalysis = async (type: "save" | "favorite") => {
    if (!websiteData) return

    try {
      const response = await fetch("/api/user/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          analysisId: websiteData._id,
          type: type === "favorite" ? "favorite" : "save",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${type} analysis`)
      }

      if (data.userId && !userId) {
        setUserId(data.userId)
      }

      toast({
        title: "Success",
        description: data.message || `${type === "favorite" ? "Added to favorites" : "Analysis saved"}`,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."
      console.error(`Error ${type}ing analysis:`, err)
      toast({
        title: "Error",
        description: `Failed to ${type} the analysis. ${errorMessage}`,
        variant: "destructive",
      })
    }
  }

  const handleSignUp = (tempUserId?: string) => {
    setUserId(tempUserId || userId || null)
    setShowSignUpModal(true)
  }

  return (
    <div className="min-h-screen flex flex-col text-foreground page-transition">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <div className="w-full max-w-4xl text-center">
          {/* Enhanced Main Page Hero Content */}
          <div className="mb-6 sm:mb-8 md:mb-12">
            <div className="inline-block p-3 sm:p-4 rounded-full bg-primary-gradient mb-4 sm:mb-6 shadow-2xl animate-pulse-glow-slow hover-lift">
              <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-white filter drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight mb-3 sm:mb-4 px-4">
              Web<span className="gradient-text">InSight</span>
            </h1>
            <p className="mt-3 sm:mt-4 md:mt-6 text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              AI-Powered Analysis for a Smarter, Greener Web.
            </p>
            <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-2 text-xs sm:text-sm text-muted-foreground px-4">
              <span className="px-2 sm:px-3 py-1 bg-primary-gradient/10 rounded-full">Performance Analysis</span>
              <span className="px-2 sm:px-3 py-1 bg-primary-gradient/10 rounded-full">Sustainability Insights</span>
              <span className="px-2 sm:px-3 py-1 bg-primary-gradient/10 rounded-full">SEO Optimization</span>
            </div>
          </div>

          <SustainabilityQuote />

          {/* Enhanced Website Form */}
          <div className="search-focus">
            <WebsiteForm onSubmit={handleAnalyzeWebsite} className="mb-8 sm:mb-10" />
          </div>
        </div>

        {/* Analysis Results Section */}
        <div className="w-full max-w-6xl mt-10 sm:mt-16">
          {isLoading && <LoadingAnimation />}
          {error && !isLoading && (
            <Alert variant="destructive" className="shadow-2xl rounded-2xl p-6 glass-card">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="font-semibold">Analysis Failed</AlertTitle>
              <AlertDescription>{error} Please check the URL or try a different website.</AlertDescription>
            </Alert>
          )}
          {websiteData && !isLoading && (
            <div className="mt-0 magic-fade-in">
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
