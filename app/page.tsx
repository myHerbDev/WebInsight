"use client"

import { useState } from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ResultsSection } from "@/components/results-section"
import { SignUpModal } from "@/components/sign-up-modal"
import { toast } from "@/components/ui/use-toast"
import type { WebsiteData } from "@/types/website-data"
import { AlertCircle, Sparkles, Brain, Zap } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { WebsiteForm } from "@/components/website-form"
import { LoadingAnimation } from "@/components/loading-animation"
import { SustainabilityQuote } from "@/components/sustainability-quote"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false)

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

      // Automatically generate basic recommendations
      await generateBasicRecommendations(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."
      console.error("Error analyzing website:", err)
      setError(errorMessage)
      toast({ title: "Analysis Error", description: errorMessage, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const generateBasicRecommendations = async (analysisData: WebsiteData) => {
    try {
      // Generate basic recommendations based on analysis
      const recommendations = []

      if (analysisData.sustainability_score < 70) {
        recommendations.push({
          category: "sustainability",
          priority: "high",
          title: "Improve Website Sustainability",
          description: `Your sustainability score is ${analysisData.sustainability_score}%. Consider switching to green hosting and optimizing resources.`,
          actionItems: [
            "Switch to a renewable energy hosting provider",
            "Optimize images and reduce file sizes",
            "Implement efficient caching strategies",
          ],
        })
      }

      if (analysisData.performance_score < 70) {
        recommendations.push({
          category: "performance",
          priority: "high",
          title: "Enhance Website Performance",
          description: `Your performance score is ${analysisData.performance_score}%. Optimize loading times and user experience.`,
          actionItems: ["Minimize HTTP requests", "Enable compression", "Optimize critical rendering path"],
        })
      }

      // Store recommendations in the analysis data
      analysisData.recommendations = recommendations

      toast({
        title: "Recommendations Generated",
        description: "Basic recommendations have been created based on your analysis.",
      })
    } catch (error) {
      console.error("Error generating recommendations:", error)
    }
  }

  const generateAIPersonalizedRecommendations = async () => {
    if (!websiteData) return

    setIsGeneratingRecommendations(true)

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "personalized_recommendations",
          websiteData: websiteData,
          analysisResults: {
            url: websiteData.url,
            sustainabilityScore: websiteData.sustainability_score,
            performanceScore: websiteData.performance_score,
            securityScore: websiteData.security_score,
            improvements: websiteData.improvements,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Failed to generate AI recommendations")

      // Update website data with AI recommendations
      setWebsiteData((prev) =>
        prev
          ? {
              ...prev,
              aiRecommendations: data.recommendations,
              personalizedInsights: data.insights,
            }
          : null,
      )

      toast({
        title: "AI Recommendations Generated",
        description: "Personalized insights and recommendations have been created using advanced AI analysis.",
      })
    } catch (error) {
      console.error("Error generating AI recommendations:", error)
      toast({
        title: "AI Generation Failed",
        description: "Unable to generate personalized recommendations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingRecommendations(false)
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
      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 py-8 sm:py-12">
        <div className="w-full max-w-4xl text-center">
          {/* Main Page Hero Content */}
          <div className="mb-8 sm:mb-12">
            <div className="inline-block p-4 rounded-full bg-primary-gradient mb-6 shadow-2xl animate-pulse-glow-slow card-hover-lift">
              <Sparkles className="h-12 w-12 sm:h-14 sm:w-14 text-white filter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground tracking-tight">
              Web<span className="text-transparent bg-clip-text bg-primary-gradient">InSight</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              AI-Powered Analysis for a Smarter, Greener Web.
            </p>
          </div>

          <SustainabilityQuote />
          <WebsiteForm onSubmit={handleAnalyzeWebsite} className="mb-8 sm:mb-10" />
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
            <div className="mt-0 space-y-6">
              <ResultsSection
                data={websiteData}
                onSignUpClick={handleSignUp}
                onSave={() => handleSaveAnalysis("save")}
                onFavorite={() => handleSaveAnalysis("favorite")}
                userId={userId}
              />

              {/* AI Personalized Recommendations Card */}
              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200/50 dark:border-purple-800/50 rounded-xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary-gradient">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">AI Personalized Recommendations</h3>
                        <p className="text-sm text-muted-foreground">
                          Get deeper insights and tailored optimization strategies
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        onClick={generateAIPersonalizedRecommendations}
                        disabled={isGeneratingRecommendations}
                        className="bg-primary-gradient hover:opacity-90 text-white"
                      >
                        {isGeneratingRecommendations ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Generate AI Insights
                          </>
                        )}
                      </Button>
                      <Button asChild variant="outline">
                        <Link href="/recommendations">View All Recommendations</Link>
                      </Button>
                    </div>
                  </div>

                  {websiteData.aiRecommendations && (
                    <div className="mt-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                      <h4 className="font-medium mb-2">AI-Generated Insights:</h4>
                      <div className="space-y-2">
                        {websiteData.aiRecommendations.slice(0, 3).map((rec: any, index: number) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 rounded-full bg-primary-gradient-middle mt-2 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">{rec.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
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
