"use client"

import { useState } from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { LoadingAnimation } from "@/components/loading-animation"
import { ResultsSection } from "@/components/results-section"
import { SignUpModal } from "@/components/sign-up-modal"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { WebsiteData } from "@/types/website-data"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import WebsiteForm from "@/components/website-form" // Declare the WebsiteForm variable

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to analyze website")
      }

      setWebsiteData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."
      console.error("Error analyzing website:", err)
      setError(errorMessage)
      toast({
        title: "Analysis Error",
        description: errorMessage,
        variant: "destructive",
      })
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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <WebsiteForm onSubmit={handleAnalyzeWebsite} />

          {isLoading && <LoadingAnimation />}

          {error && !isLoading && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>{error} Please check the URL or try a different website.</AlertDescription>
            </Alert>
          )}

          {websiteData && !isLoading && (
            <ResultsSection
              data={websiteData}
              onSignUpClick={handleSignUp}
              onSave={() => handleSaveAnalysis("save")}
              onFavorite={() => handleSaveAnalysis("favorite")}
              userId={userId}
            />
          )}
        </div>
      </main>
      <Footer />
      <Toaster /> {/* Add Toaster for shadcn/ui toasts */}
      {showSignUpModal && (
        <SignUpModal
          onClose={() => setShowSignUpModal(false)}
          tempUserId={userId}
          onSignUpSuccess={(newUserId) => {
            setUserId(newUserId)
            setShowSignUpModal(false)
            toast({
              title: "Account Created",
              description: "You've successfully signed up!",
            })
          }}
        />
      )}
    </div>
  )
}
