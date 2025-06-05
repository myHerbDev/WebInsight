"use client"

import { useState } from "react"
import { WebsiteForm } from "@/components/website-form"
import { ResultsSection } from "@/components/results-section"
import { EnhancedAIGenerator } from "@/components/enhanced-ai-generator"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SignUpModal } from "@/components/sign-up-modal"
import { LoginModal } from "@/components/login-modal"
import { LoadingAnimation } from "@/components/loading-animation"
import { toast } from "@/components/ui/use-toast"
import type { WebsiteData } from "@/types/website-data"

export default function HomePage() {
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (url: string) => {
    if (!url || !url.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setWebsiteData(null)

    try {
      console.log("🚀 Starting website analysis for:", url)

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      console.log("📥 Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Analysis failed:", errorText)

        let errorMessage = "Failed to analyze website"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          // If JSON parsing fails, use the raw text
          errorMessage = errorText || errorMessage
        }

        throw new Error(errorMessage)
      }

      const responseText = await response.text()
      console.log("📄 Response text length:", responseText.length)

      if (!responseText || responseText.trim().length === 0) {
        throw new Error("Empty response from server")
      }

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError)
        console.error("❌ Response text:", responseText.substring(0, 500))
        throw new Error("Invalid response format from server")
      }

      if (!data || typeof data !== "object") {
        throw new Error("Invalid data format received")
      }

      console.log("✅ Analysis completed successfully")
      setWebsiteData(data)

      toast({
        title: "Analysis Complete!",
        description: `Successfully analyzed ${data.title || url}`,
      })
    } catch (error: any) {
      console.error("💥 Analysis error:", error)
      const errorMessage = error.message || "An unexpected error occurred"
      setError(errorMessage)

      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSignUpClick = () => {
    setShowSignUpModal(true)
  }

  const handleLoginClick = () => {
    setShowLoginModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header onSignUpClick={handleSignUpClick} onLoginClick={handleLoginClick} />

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            WebInSight
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive website analysis with AI-powered insights. Analyze performance, sustainability, security, and
            generate professional content.
          </p>
        </section>

        {/* Website Analysis Form */}
        <section className="max-w-2xl mx-auto">
          <WebsiteForm onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
        </section>

        {/* Loading State */}
        {isAnalyzing && (
          <section className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <LoadingAnimation />
              <p className="text-gray-600 mt-4">Analyzing website...</p>
            </div>
          </section>
        )}

        {/* Error State */}
        {error && !isAnalyzing && (
          <section className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Analysis Failed</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </section>
        )}

        {/* Results Section */}
        {websiteData && !isAnalyzing && (
          <section className="max-w-6xl mx-auto space-y-8">
            <ResultsSection data={websiteData} />
          </section>
        )}

        {/* AI Content Generator */}
        {websiteData && !isAnalyzing && (
          <section className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Content Generator</h2>
              <EnhancedAIGenerator websiteData={websiteData} onSignUpClick={handleSignUpClick} />
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Modals */}
      <SignUpModal isOpen={showSignUpModal} onClose={() => setShowSignUpModal(false)} />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  )
}
