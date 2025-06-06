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
// Removed ActionButtonsBar import

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
    setUserId(tempUserId || userId || null) // Ensure userId is string or null
    setShowSignUpModal(true)
  }

  return (
    <div className="min-h-screen flex flex-col text-foreground">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 py-8 sm:py-12">
        <div className="w-full max-w-4xl text-center">
          {/* Main Page Hero Content */}
          <div className="mb-8 sm:mb-12">
            <div className="inline-block p-3 rounded-full bg-primary-gradient mb-5 shadow-lg animate-pulse-glow-slow">
              <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-white filter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              Web<span className="text-transparent bg-clip-text bg-primary-gradient">InSight</span>
            </h1>
            <p className="mt-3 sm:mt-4 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto">
              AI-Powered Analysis for a Smarter, Greener Web.
            </p>
          </div>

          <SustainabilityQuote />
          <WebsiteForm onSubmit={handleAnalyzeWebsite} className="mb-8 sm:mb-10" />
          {/* ActionButtonsBar removed as requested */}
        </div>

        {/* Analysis Results Section */}
        <div className="w-full max-w-4xl mt-10 sm:mt-16">
          {isLoading && <LoadingAnimation />}
          {error && !isLoading && (
            <Alert variant="destructive" className="shadow-lg rounded-xl p-6">
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
