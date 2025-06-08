"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Search, BarChart, ShieldCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import type { WebsiteData } from "@/types/website-data"
import { SearchResultsDisplay } from "@/components/search-results-display" // Ensure this path is correct
import { Separator } from "@/components/ui/separator"

export default function HomePage() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [analysisData, setAnalysisData] = useState<WebsiteData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault()

    if (!url.trim()) {
      toast({ title: "Invalid URL", description: "Please enter a valid website URL.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    setError(null)
    setAnalysisData(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
      const data: WebsiteData = await response.json() // Type assertion
      if (!response.ok) {
        console.error("Analysis API Error:", data)
        // @ts-ignore
        throw new Error(data.error || data.message || "Failed to analyze website.")
      }
      console.log("API Response Data:", data) // For debugging
      setAnalysisData(data)
    } catch (err: any) {
      console.error("Handle Analyze Error:", err)
      setError(err.message)
      toast({ title: "Analysis Failed", description: err.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const featureCards = [
    {
      title: "Performance Analysis",
      description: "Deep dive into loading speeds, optimization scores, and technical performance metrics.",
      icon: BarChart,
      details: "Analyze page load times, resource optimization, mobile performance, and Core Web Vitals",
    },
    {
      title: "Content Intelligence",
      description: "Comprehensive content analysis including SEO, readability, and structure assessment.",
      icon: Search,
      details: "Extract keywords, analyze content quality, check heading structure, and evaluate SEO factors",
    },
    {
      title: "Security & Hosting",
      description: "Detailed hosting information, SSL certificates, and security vulnerability scanning.",
      icon: ShieldCheck,
      details: "Identify hosting providers, check SSL status, analyze security headers, and detect vulnerabilities",
    },
    {
      title: "AI Content Generation",
      description: "Transform analysis data into professional reports, blog posts, and marketing content.",
      icon: Sparkles,
      details: "Generate research reports, academic summaries, blog posts, and marketing copy using AI",
    },
    {
      title: "Technology Detection",
      description: "Identify frameworks, CMS platforms, analytics tools, and third-party integrations.",
      icon: Search,
      details: "Detect JavaScript frameworks, content management systems, analytics platforms, and plugins",
    },
    {
      title: "Accessibility Audit",
      description: "Evaluate website accessibility, mobile-friendliness, and user experience factors.",
      icon: ShieldCheck,
      details: "Check WCAG compliance, mobile responsiveness, navigation structure, and usability",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            WScrapierr
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Unlock the web's potential. Magically scrape data and generate content with AI-powered intelligence.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-2xl mx-auto bg-card p-1 rounded-xl shadow-lg border mb-12"
      >
        <form onSubmit={handleAnalyze} className="flex gap-0">
          <Input
            type="url"
            placeholder="Enter website URL to analyze or scrape..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-12 text-base flex-grow rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            aria-label="Website URL"
          />
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="h-12 text-base bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90 text-white rounded-l-none"
          >
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
            {isLoading ? "Analyzing..." : "Go Magic"}
          </Button>
        </form>
      </motion.div>

      {/* Results display area */}
      <motion.div
        initial={false} // No initial animation for this container itself
        animate={{ opacity: analysisData || error || isLoading ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <SearchResultsDisplay results={analysisData} isLoading={isLoading} error={error} />
      </motion.div>

      {/* Feature cards only show if no analysis data, no loading, and no error */}
      {!analysisData && !isLoading && !error && (
        <>
          <motion.div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Website Analysis</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our advanced analysis engine examines every aspect of your website, from performance and security to
              content quality and SEO optimization. Get actionable insights to improve your digital presence.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
              hidden: { opacity: 0 },
            }}
          >
            {featureCards.map((feature, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm hover:bg-card/90">
                  <CardHeader className="flex flex-row items-start gap-4 pb-3">
                    <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-3 rounded-lg w-fit shrink-0">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground/80 leading-relaxed">{feature.details}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
      <Separator className="my-16" />
      <div className="text-center text-muted-foreground text-sm">
        <p>WScrapierr helps you analyze websites, understand their structure, and generate insightful content.</p>
        <p>Powered by cutting-edge AI and web technologies.</p>
      </div>
    </div>
  )
}
