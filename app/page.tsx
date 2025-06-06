"use client"

import { useState } from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { LoadingAnimation } from "@/components/loading-animation"
import { ResultsSection } from "@/components/results-section"
import { SignUpModal } from "@/components/sign-up-modal"
import { WebsiteForm } from "@/components/website-form"
import { toast } from "@/components/ui/use-toast"
import type { WebsiteData } from "@/types/website-data"

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
        throw new Error(data.error || "Failed to analyze website")
      }

      setWebsiteData(data)
    } catch (error) {
      console.error("Error analyzing website:", error)
      setError("Failed to analyze the website. Please try again.")
      toast({
        title: "Error",
        description: "Failed to analyze the website. Please try again.",
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <WebsiteForm onSubmit={handleAnalyzeWebsite} />

          {isLoading && <LoadingAnimation />}

          {error && !isLoading && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-6">
              <p className="text-red-800 dark:text-red-300">{error}</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                Please check your URL and try again. If the problem persists, try a different website.
              </p>
            </div>
          )}

          {websiteData && (
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
  )
}
