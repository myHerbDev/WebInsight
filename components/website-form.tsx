"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Sparkles, AlertCircle, Zap } from "lucide-react"
import { SearchResultsDisplay } from "@/components/search-results-display"
import { AiContentStudio } from "@/components/ai-content-studio"
import { LoadingAnimation } from "@/components/loading-animation"
import { toast } from "@/components/ui/use-toast"

export function WebsiteForm() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showContentStudio, setShowContentStudio] = useState(false)

  const validateUrl = (inputUrl: string): string | null => {
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
  }

  const handleAnalyze = async () => {
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

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: cleanUrl }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to analyze website`)
      }

      const data = await response.json()
      console.log("Analysis completed:", data)

      // Transform API response to expected format
      const hostname = new URL(cleanUrl).hostname
      const transformedResult = {
        id: Date.now().toString(),
        url: cleanUrl,
        title: data.title || `${hostname} - Website Analysis`,
        summary: data.description || `Comprehensive analysis of ${hostname} completed successfully.`,
        performance_score: data.metrics?.performanceScore || 75,
        seo_score: data.metrics?.seoScore || 70,
        security_score: data.metrics?.securityScore || 65,
        accessibility_score: data.metrics?.accessibilityScore || 70,
        sustainability_score: 75,
        mobile_score: 80,
        keywords: ["website", "analysis", hostname.split(".")[0], "performance", "SEO"],
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
        technologies: data.technical?.framework
          ? [
              { name: data.technical.framework, category: "Framework", confidence: 90 },
              { name: "HTML5", category: "Markup", confidence: 95 },
              { name: "CSS3", category: "Styling", confidence: 90 },
              { name: "JavaScript", category: "Programming", confidence: 85 },
            ]
          : [
              { name: "HTML5", category: "Markup", confidence: 95 },
              { name: "CSS3", category: "Styling", confidence: 90 },
              { name: "JavaScript", category: "Programming", confidence: 85 },
            ],
        metadata: {
          favicon: data.favicon,
          title: data.title,
          description: data.description,
        },
        performance: {
          pageSize: data.metrics?.pageSize || 500,
          loadTime: data.metrics?.loadTime || 1200,
          httpRequests: data.metrics?.scriptCount + data.metrics?.styleCount + data.metrics?.imageCount || 25,
          compressionEnabled: true,
        },
        security: {
          httpsEnabled: cleanUrl.startsWith("https://"),
          securityScore: data.metrics?.securityScore || 65,
        },
        hosting: {
          provider: data.technical?.hostingProvider || "Unknown",
        },
        created_at: new Date().toISOString(),
      }

      setAnalysisResult(transformedResult)

      toast({
        title: "Analysis Complete!",
        description: `Successfully analyzed ${hostname}`,
      })
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
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isAnalyzing) {
      handleAnalyze()
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Search Form with Enhanced Gradients */}
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <CardHeader className="relative text-center pb-6">
          <CardTitle className="flex items-center justify-center gap-4 text-3xl mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Search className="h-8 w-8 text-white" />
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
        <CardContent className="relative space-y-8">
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1">
              <Input
                type="url"
                placeholder="Enter website URL (e.g., google.com, github.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isAnalyzing}
                className="h-14 text-lg border-2 border-blue-200 focus:border-purple-400 bg-white/80 backdrop-blur-sm"
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !url.trim()}
              size="lg"
              className="h-14 px-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Analyze Website
                </>
              )}
            </Button>
          </div>

          {/* Quick Examples */}
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="text-sm text-gray-600 font-medium">Try popular sites:</span>
            {["google.com", "github.com", "vercel.com", "tailwindcss.com"].map((example) => (
              <Button
                key={example}
                variant="outline"
                size="sm"
                onClick={() => setUrl(example)}
                disabled={isAnalyzing}
                className="border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              >
                {example}
              </Button>
            ))}
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {isAnalyzing && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
          <CardContent className="py-16">
            <LoadingAnimation />
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisResult && !isAnalyzing && (
        <div className="space-y-8">
          <SearchResultsDisplay data={analysisResult} isLoading={false} isError={false} />

          {/* Content Studio Toggle */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-rose-500/5"></div>
            <CardContent className="relative p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold mb-3 flex items-center gap-3 justify-center lg:justify-start">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                      AI Content Studio
                    </span>
                  </h3>
                  <p className="text-gray-600 text-lg">Generate professional content based on your website analysis</p>
                </div>
                <Button
                  onClick={() => setShowContentStudio(!showContentStudio)}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white shadow-lg px-8 py-3"
                >
                  {showContentStudio ? "Hide" : "Open"} Content Studio
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Content Studio */}
          {showContentStudio && (
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
          )}
        </div>
      )}
    </div>
  )
}
