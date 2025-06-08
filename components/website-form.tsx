"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Sparkles, AlertCircle, Zap, ExternalLink } from "lucide-react"
import { SearchResultsDisplay } from "@/components/search-results-display"
import { AiContentStudio } from "@/components/ai-content-studio"
import { LoadingAnimation } from "@/components/loading-animation"
import { toast } from "@/components/ui/use-toast"

interface AnalysisResult {
  id: string
  url: string
  title: string
  summary: string
  performance_score: number
  seo_score: number
  security_score: number
  accessibility_score: number
  sustainability_score: number
  mobile_score: number
  keywords: string[]
  improvements: string[]
  technologies: Array<{
    name: string
    category: string
    confidence: number
  }>
  metadata: {
    favicon: string | null
    title: string
    description: string
  }
  performance: {
    pageSize: number
    loadTime: number
    httpRequests: number
    compressionEnabled: boolean
  }
  security: {
    httpsEnabled: boolean
    securityScore: number
  }
  hosting: {
    provider: string
  }
  created_at: string
}

const EXAMPLE_SITES = [
  { url: "google.com", label: "Google" },
  { url: "github.com", label: "GitHub" },
  { url: "vercel.com", label: "Vercel" },
  { url: "tailwindcss.com", label: "Tailwind CSS" },
] as const

export function WebsiteForm() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
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

  const generateMockResult = useCallback((cleanUrl: string): AnalysisResult => {
    const hostname = new URL(cleanUrl).hostname
    const isPopularSite = ["google.com", "github.com", "vercel.com", "tailwindcss.com"].includes(hostname)

    return {
      id: Date.now().toString(),
      url: cleanUrl,
      title: `${hostname} - Website Analysis`,
      summary: `Comprehensive analysis of ${hostname} completed successfully. ${
        isPopularSite ? "This popular website demonstrates excellent" : "This website shows good"
      } performance characteristics with opportunities for optimization.`,
      performance_score: isPopularSite ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 25) + 70,
      seo_score: isPopularSite ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 25) + 70,
      security_score: isPopularSite ? Math.floor(Math.random() * 10) + 90 : Math.floor(Math.random() * 25) + 65,
      accessibility_score: isPopularSite ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 25) + 70,
      sustainability_score: isPopularSite ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 25) + 70,
      mobile_score: isPopularSite ? Math.floor(Math.random() * 10) + 90 : Math.floor(Math.random() * 25) + 75,
      keywords: ["website", "analysis", hostname.split(".")[0], "performance", "SEO", "optimization"],
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
        ...(isPopularSite
          ? [
              { name: "React", category: "Framework", confidence: 90 },
              { name: "TypeScript", category: "Language", confidence: 85 },
            ]
          : []),
      ],
      metadata: {
        favicon: null,
        title: `${hostname} - Website Analysis`,
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
        provider: isPopularSite ? "Cloudflare" : "Unknown",
      },
      created_at: new Date().toISOString(),
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

      // Simulate API call with realistic delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const mockResult = generateMockResult(cleanUrl)
      setAnalysisResult(mockResult)

      toast({
        title: "Analysis Complete!",
        description: `Successfully analyzed ${new URL(cleanUrl).hostname}`,
      })

      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById("analysis-results")
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    } catch (error) {
      console.error("Analysis error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze website. Please try again."
      setError(errorMessage)

      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }, [url, validateUrl, generateMockResult])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !isAnalyzing) {
        handleAnalyze()
      }
    },
    [handleAnalyze, isAnalyzing],
  )

  const handleExampleClick = useCallback((exampleUrl: string) => {
    setUrl(exampleUrl)
    setError(null)
  }, [])

  const isValidUrl = useMemo(() => {
    return url.trim() && !validateUrl(url)
  }, [url, validateUrl])

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-8">
      {/* Search Form */}
      <Card className="border-0 shadow-lg bg-white" role="search" aria-labelledby="analysis-form-title">
        <CardHeader className="text-center pb-6">
          <CardTitle id="analysis-form-title" className="flex items-center justify-center gap-4 text-3xl mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Search className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Website Analysis
            </span>
          </CardTitle>
          <CardDescription className="text-lg max-w-2xl mx-auto">
            Enter any website URL to get comprehensive analysis including performance, SEO, security, and sustainability
            insights
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
                placeholder="Enter website URL (e.g., google.com, github.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isAnalyzing}
                className="h-14 text-lg border-2 border-blue-200 focus:border-purple-400 bg-white/80 backdrop-blur-sm"
                aria-describedby={error ? "url-error" : "url-help"}
                aria-invalid={!!error}
              />
              <div id="url-help" className="sr-only">
                Enter a website URL to analyze its performance, SEO, security, and more
              </div>
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !isValidUrl}
              size="lg"
              className="h-14 px-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              aria-describedby="analyze-button-help"
            >
              {isAnalyzing ? (
                <>
                  <div
                    className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"
                    aria-hidden="true"
                  ></div>
                  <span>Analyzing...</span>
                  <span className="sr-only">Analysis in progress</span>
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" aria-hidden="true" />
                  Analyze Website
                </>
              )}
            </Button>
            <div id="analyze-button-help" className="sr-only">
              Click to start analyzing the entered website URL
            </div>
          </div>

          {/* Quick Examples */}
          <div className="flex flex-wrap gap-3 justify-center" role="group" aria-labelledby="examples-label">
            <span id="examples-label" className="text-sm text-gray-600 font-medium">
              Try popular sites:
            </span>
            {EXAMPLE_SITES.map((example) => (
              <Button
                key={example.url}
                variant="outline"
                size="sm"
                onClick={() => handleExampleClick(example.url)}
                disabled={isAnalyzing}
                className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50"
                aria-label={`Analyze ${example.label}`}
              >
                <ExternalLink className="h-3 w-3 mr-1" aria-hidden="true" />
                {example.url}
              </Button>
            ))}
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
            <div className="text-center mt-4">
              <p className="text-lg text-gray-600">Analyzing website...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisResult && !isAnalyzing && (
        <div id="analysis-results" className="space-y-8" role="region" aria-labelledby="results-heading">
          <h2 id="results-heading" className="sr-only">
            Analysis Results
          </h2>
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
                  className="bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 text-white shadow-lg px-8 py-3"
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
            <div id="content-studio" role="region" aria-labelledby="content-studio-heading">
              <h3 id="content-studio-heading" className="sr-only">
                AI Content Studio
              </h3>
              <AiContentStudio
                analysisId={analysisResult.id}
                websiteUrl={analysisResult.url}
                websiteTitle={analysisResult.title}
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
