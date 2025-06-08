"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Sparkles, AlertCircle, Zap } from "lucide-react"
import { SearchResultsDisplay } from "@/components/search-results-display"
import { AiContentStudio } from "@/components/ai-content-studio"
import { LoadingAnimation } from "@/components/loading-animation"
import { toast } from "@/components/ui/use-toast"

const POPULAR_EXAMPLES = ["myherb.co.il", "google.com", "github.com", "vercel.com"]

export function WebsiteForm() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showContentStudio, setShowContentStudio] = useState(false)

  const validateUrl = useCallback((inputUrl: string): string | null => {
    if (!inputUrl.trim()) {
      return "Please enter a website URL"
    }

    let cleanUrl = inputUrl.trim()
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = `https://${cleanUrl}`
    }

    try {
      const urlObj = new URL(cleanUrl)
      if (!urlObj.hostname.includes(".")) {
        return "Please enter a valid website URL"
      }
      return null
    } catch {
      return "Please enter a valid website URL"
    }
  }, [])

  const handleAnalyze = useCallback(async () => {
    const validationError = validateUrl(url)
    if (validationError) {
      setError(validationError)
      toast({
        title: "Invalid URL",
        description: validationError,
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setAnalysisResult(null)
    setShowContentStudio(false)

    let cleanUrl = url.trim()
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = `https://${cleanUrl}`
    }

    try {
      console.log(`Starting analysis for: ${cleanUrl}`)

      // Enhanced mock result with better data
      const hostname = new URL(cleanUrl).hostname
      const mockResult = {
        id: Date.now().toString(),
        url: cleanUrl,
        title: `${hostname} - WSfynder Analysis`,
        summary: `Comprehensive analysis of ${hostname} completed successfully using WSfynder's advanced AI algorithms.`,
        performance_score: Math.floor(Math.random() * 20) + 75,
        seo_score: Math.floor(Math.random() * 20) + 70,
        security_score: Math.floor(Math.random() * 20) + 65,
        accessibility_score: Math.floor(Math.random() * 20) + 70,
        sustainability_score: Math.floor(Math.random() * 20) + 75,
        mobile_score: Math.floor(Math.random() * 20) + 75,
        keywords: ["website", "analysis", hostname.split(".")[0], "performance", "SEO", "WSfynder"],
        improvements: [
          "🚀 Optimize image loading and compression for faster page speeds",
          "📝 Enhance meta descriptions with compelling calls-to-action",
          "🔒 Implement Content Security Policy headers for enhanced protection",
          "⚡ Minimize JavaScript bundle size through code splitting",
          "📊 Add structured data markup for rich search results",
          "♿ Improve accessibility with ARIA labels and keyboard navigation",
          "📱 Optimize touch targets for better mobile interaction",
          "🗜️ Enable Brotli compression for superior file size reduction",
        ],
        technologies: [
          { name: "HTML5", category: "Markup", confidence: 95 },
          { name: "CSS3", category: "Styling", confidence: 90 },
          { name: "JavaScript", category: "Programming", confidence: 85 },
          { name: "React", category: "Framework", confidence: 80 },
        ],
        metadata: {
          favicon: null,
          title: `${hostname} - WSfynder Analysis`,
          description: `Comprehensive analysis of ${hostname} completed successfully.`,
        },
        performance: {
          pageSize: Math.floor(Math.random() * 500) + 200,
          loadTime: Math.floor(Math.random() * 1000) + 500,
          httpRequests: Math.floor(Math.random() * 30) + 10,
          compressionEnabled: Math.random() > 0.3,
        },
        security: {
          httpsEnabled: cleanUrl.startsWith("https://"),
          securityScore: Math.floor(Math.random() * 20) + 65,
        },
        hosting: {
          provider: "Unknown",
        },
        created_at: new Date().toISOString(),
      }

      // Simulate network delay
      setTimeout(() => {
        setAnalysisResult(mockResult)
        setIsAnalyzing(false)

        toast({
          title: "Analysis Complete!",
          description: `Successfully analyzed ${hostname} with WSfynder`,
        })
      }, 3000)
    } catch (error) {
      console.error("Analysis error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze website. Please try again."
      setError(errorMessage)

      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      })
      setIsAnalyzing(false)
    }
  }, [url, validateUrl])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !isAnalyzing) {
        handleAnalyze()
      }
    },
    [handleAnalyze, isAnalyzing],
  )

  const handleExampleClick = useCallback((example: string) => {
    setUrl(example)
  }, [])

  const memoizedExamples = useMemo(
    () =>
      POPULAR_EXAMPLES.map((example) => (
        <Button
          key={example}
          variant="outline"
          size="sm"
          onClick={() => handleExampleClick(example)}
          disabled={isAnalyzing}
          className="border-purple-200 hover:bg-purple-50 hover:border-purple-300 focus:ring-purple-500"
        >
          {example}
        </Button>
      )),
    [handleExampleClick, isAnalyzing],
  )

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-8">
      {/* Search Form with WSfynder Gradients */}
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="text-center pb-6">
          <CardTitle className="flex items-center justify-center gap-4 text-3xl mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-green-500 flex items-center justify-center shadow-md">
              <Search className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
              WSfynder Analysis
            </span>
          </CardTitle>
          <CardDescription className="text-lg max-w-2xl mx-auto">
            Enter any website URL to get comprehensive analysis including performance, SEO, security, and sustainability
            insights powered by AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1">
              <label htmlFor="website-url" className="sr-only">
                Website URL
              </label>
              <Input
                id="website-url"
                type="url"
                placeholder="Enter website URL (e.g., myherb.co.il, google.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isAnalyzing}
                className="h-14 text-lg border-2 border-purple-200 focus:border-green-400 focus:ring-green-400"
                aria-describedby={error ? "url-error" : "url-help"}
              />
              <p id="url-help" className="sr-only">
                Enter a website URL to analyze its performance, SEO, security, and more
              </p>
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !url.trim()}
              size="lg"
              className="h-14 px-8 bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 text-white shadow-md focus:ring-purple-500"
            >
              {isAnalyzing ? (
                <>
                  <div
                    className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                    aria-hidden="true"
                  ></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" aria-hidden="true" />
                  Analyze with WSfynder
                </>
              )}
            </Button>
          </div>

          {/* Quick Examples */}
          <div className="flex flex-wrap gap-3 justify-center" role="group" aria-labelledby="examples-heading">
            <span id="examples-heading" className="text-sm text-gray-600 font-medium">
              Try popular sites:
            </span>
            {memoizedExamples}
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="max-w-2xl mx-auto" role="alert">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              <AlertDescription id="url-error">{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {isAnalyzing && (
        <Card className="border-0 shadow-lg bg-white" role="status" aria-live="polite">
          <CardContent className="py-16">
            <LoadingAnimation />
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisResult && !isAnalyzing && (
        <div className="space-y-8">
          <SearchResultsDisplay data={analysisResult} />

          {/* Content Studio Toggle */}
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold mb-3 flex items-center gap-3 justify-center lg:justify-start">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-green-500 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <span className="bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
                      AI Content Studio
                    </span>
                  </h3>
                  <p className="text-gray-600 text-lg">Generate professional content based on your website analysis</p>
                </div>
                <Button
                  onClick={() => setShowContentStudio(!showContentStudio)}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 text-white shadow-md px-8 py-3 focus:ring-purple-500"
                  aria-expanded={showContentStudio}
                  aria-controls="content-studio"
                >
                  {showContentStudio ? "Hide" : "Open"} Content Studio
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Content Studio */}
          {showContentStudio && (
            <div id="content-studio">
              <AiContentStudio
                analysisId={analysisResult.id}
                websiteUrl={analysisResult.url}
                websiteTitle={analysisResult.title || undefined}
                onSignUpClick={() => {
                  toast({
                    title: "Sign Up",
                    description: "Sign up feature coming soon!",
                  })
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
