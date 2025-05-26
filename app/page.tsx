"use client"

import { useState } from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { LoadingAnimation } from "@/components/loading-animation"
import { ResultsSection } from "@/components/results-section"
import { SignUpModal } from "@/components/sign-up-modal"
import { WebsiteForm } from "@/components/website-form"
import { ErrorBoundary } from "@/components/error-boundary"
import { AnalysisSummary } from "@/components/analysis-summary"
import { toast } from "@/components/ui/use-toast"
import type { WebsiteData } from "@/types/website-data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

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
      // Validate URL format
      try {
        new URL(url.startsWith("http") ? url : `https://${url}`)
      } catch {
        throw new Error("Please enter a valid URL (e.g., example.com or https://example.com)")
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || `Server error: ${response.status}`)
      }

      if (data.error) {
        throw new Error(data.error)
      }

      // Validate that we received proper analysis data
      if (!data.title || !data.url) {
        throw new Error("Incomplete analysis data received. Please try again.")
      }

      setWebsiteData(data)

      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${data.title}`,
      })
    } catch (error) {
      console.error("Error analyzing website:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze the website. Please try again."
      setError(errorMessage)
      toast({
        title: "Analysis Failed",
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

      // If we got a userId back and don't have one yet, save it
      if (data.userId && !userId) {
        setUserId(data.userId)
      }

      toast({
        title: "Success",
        description: data.message || `${type === "favorite" ? "Added to favorites" : "Analysis saved"}`,
      })
    } catch (error) {
      console.error(`Error ${type}ing analysis:`, error)
      toast({
        title: "Error",
        description: `Failed to ${type} the analysis. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleSignUp = (tempUserId: string) => {
    // If we have a userId from a temporary save, pass it to the modal
    setUserId(tempUserId || userId)
    setShowSignUpModal(true)
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <WebsiteForm onSubmit={handleAnalyzeWebsite} />

            {isLoading && <LoadingAnimation />}

            {error && !isLoading && (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>
                  {error}
                  <p className="text-sm mt-2">
                    Please check your URL and try again. If the problem persists, try a different website.
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {websiteData && !isLoading && (
              <>
                <Alert className="mt-6 border-green-200 bg-green-50 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800 dark:text-green-200">Analysis Complete</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    Successfully analyzed {websiteData.title}. View the detailed results below.
                  </AlertDescription>
                </Alert>

                <div className="mt-6">
                  <AnalysisSummary data={websiteData} />
                </div>

                <div className="mt-6">
                  <ResultsSection
                    data={websiteData}
                    onSignUpClick={handleSignUp}
                    onSave={() => handleSaveAnalysis("save")}
                    onFavorite={() => handleSaveAnalysis("favorite")}
                    userId={userId}
                  />
                </div>
              </>
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
              toast({
                title: "Success",
                description: "Account created successfully!",
              })
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}
