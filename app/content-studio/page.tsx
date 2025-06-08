"use client" // This page will involve client-side interactions for content generation

import { useState } from "react"
import { AiContentStudio } from "@/components/ai-content-studio"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { Sparkles, LinkIcon, Loader2, Info } from "lucide-react"
import type { WebsiteData } from "@/types/website-data"

export default function ContentStudioPage() {
  const [targetUrl, setTargetUrl] = useState("")
  const [analysisData, setAnalysisData] = useState<WebsiteData | null>(null)
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  // Dummy onSignUpClick for now, replace with actual modal logic
  const handleSignUpClick = () => {
    toast({ title: "Sign Up", description: "Sign up to save content and unlock more features!" })
  }

  const handleAnalyzeUrl = async () => {
    if (!targetUrl.trim()) {
      toast({ title: "Invalid URL", description: "Please enter a valid website URL.", variant: "destructive" })
      return
    }

    // Clean and prepare URL
    let cleanUrl = targetUrl.trim()
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl
    }

    setIsLoadingAnalysis(true)
    setAnalysisError(null)
    setAnalysisData(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanUrl }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze website.")
      }
      setAnalysisData(data)
      toast({
        title: "Analysis Complete!",
        description: `Successfully analyzed ${cleanUrl}. You can now generate content.`,
      })
    } catch (err: any) {
      setAnalysisError(err.message)
      toast({ title: "Analysis Failed", description: err.message, variant: "destructive" })
    } finally {
      setIsLoadingAnalysis(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            WScrapierr Content Studio
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform website data into compelling content. Analyze any URL and let our AI craft various content types for
          you.
        </p>
      </header>

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <LinkIcon className="h-6 w-6 text-primary" />
            Analyze Website for Content Generation
          </CardTitle>
          <CardDescription>
            Enter a website URL to fetch and analyze its data. This data will be used as the foundation for AI content
            generation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="url"
              placeholder="https://example.com"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="h-11 text-base flex-grow"
              aria-label="Website URL to analyze"
            />
            <Button
              size="lg"
              onClick={handleAnalyzeUrl}
              disabled={isLoadingAnalysis}
              className="h-11 text-base w-full sm:w-auto"
            >
              {isLoadingAnalysis ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Analyze URL
                </>
              )}
            </Button>
          </div>
          {analysisError && <p className="text-destructive mt-3 text-sm">{analysisError}</p>}
        </CardContent>
      </Card>

      {analysisData ? (
        <AiContentStudio
          analysisId={analysisData._id} // Assuming your analysis data has an _id
          tone="professional" // Default tone, can be made configurable
          onSignUpClick={handleSignUpClick}
        />
      ) : (
        !isLoadingAnalysis && (
          <Alert className="mt-8">
            <Info className="h-4 w-4" />
            <AlertTitle>Ready to Generate?</AlertTitle>
            <AlertDescription>
              {analysisError
                ? "Please resolve the analysis error above or try a different URL to begin content generation."
                : "Enter a URL and click 'Analyze URL' to load website data. Once analyzed, the AI Content Studio will appear here, ready to generate content."}
            </AlertDescription>
          </Alert>
        )
      )}
      {isLoadingAnalysis && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg font-medium text-muted-foreground">Analyzing website data...</p>
          <p className="text-sm text-muted-foreground/70 mt-1">This might take a few moments.</p>
        </div>
      )}
    </div>
  )
}
