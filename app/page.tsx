"use client"

import type React from "react"

import { useState } from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ResultsSection } from "@/components/results-section"
import { SignUpModal } from "@/components/sign-up-modal"
import { toast } from "@/components/ui/use-toast"
import type { WebsiteData } from "@/types/website-data"
import { AlertCircle, Search } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoadingAnimation } from "@/components/loading-animation"
import { Logo } from "@/components/logo"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [url, setUrl] = useState("")

  const handleAnalyzeWebsite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    let formattedUrl = url.trim()
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`
    }

    setIsLoading(true)
    setWebsiteData(null)
    setError(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formattedUrl }),
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

  // Google-style particles
  const particles = [
    { size: 20, top: "10%", left: "5%", className: "particle particle-1" },
    { size: 15, top: "20%", left: "80%", className: "particle particle-2" },
    { size: 25, top: "70%", left: "15%", className: "particle particle-3" },
    { size: 12, top: "60%", left: "75%", className: "particle particle-4" },
    { size: 18, top: "40%", left: "30%", className: "particle particle-1" },
    { size: 22, top: "30%", left: "60%", className: "particle particle-3" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Google-style particles */}
      {particles.map((particle, i) => (
        <div
          key={i}
          className={particle.className}
          style={{
            width: particle.size,
            height: particle.size,
            top: particle.top,
            left: particle.left,
          }}
        />
      ))}

      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-20">
        <div className="w-full max-w-3xl text-center mb-12">
          {/* Google-style minimalist logo */}
          <div className="flex justify-center mb-8">
            <Logo size="lg" showText={false} />
          </div>

          {/* Google-style heading */}
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            Web<span className="magic-text">InSight</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">AI-Powered Website Analysis & Optimization</p>

          {/* Google-style search form */}
          <form onSubmit={handleAnalyzeWebsite} className="relative mb-8">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., example.com)"
              className="google-search"
              aria-label="Website URL"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 google-button h-12 w-12 flex items-center justify-center rounded-full p-0"
              aria-label="Analyze Website"
              disabled={!url.trim()}
            >
              <Search className="h-5 w-5" />
            </button>
          </form>

          {/* Features list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {[
              { title: "Performance", description: "Analyze loading speed & core metrics" },
              { title: "SEO", description: "Discover optimization opportunities" },
              { title: "Sustainability", description: "Measure environmental impact" },
            ].map((feature, i) => (
              <div key={i} className="google-card">
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis Results Section */}
        <div className="w-full max-w-4xl">
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
