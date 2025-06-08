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
import { SearchResultsDisplay } from "@/components/search-results-display"
import { Separator } from "@/components/ui/separator"

export default function HomePage() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [analysisData, setAnalysisData] = useState<WebsiteData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault() // Prevent form submission if called from form

    if (!url.trim()) {
      toast({ title: "Invalid URL", description: "Please enter a valid website URL.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    setError(null)
    setAnalysisData(null) // Clear previous results

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })
      const data = await response.json()
      if (!response.ok) {
        console.error("Analysis API Error:", data)
        throw new Error(data.error || data.message || "Failed to analyze website.")
      }
      setAnalysisData(data)
      // toast({ title: "Analysis Complete!", description: `Successfully analyzed ${url}` });
    } catch (err: any) {
      console.error("Handle Analyze Error:", err)
      setError(err.message)
      toast({ title: "Analysis Failed", description: err.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const featureCards = [
    { title: "Intelligent Scraping", description: "Extract data with precision and ease.", icon: Search },
    { title: "AI Content Generation", description: "Create diverse content types in moments.", icon: Sparkles },
    { title: "Hosting Insights", description: "Manage and review hosting provider information.", icon: BarChart },
    { title: "Secure & Reliable", description: "Built with modern security best practices.", icon: ShieldCheck },
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

      {isLoading && (
        <div className="flex flex-col items-center justify-center text-center my-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Analyzing {url}...</p>
          <p className="text-sm text-muted-foreground/80">This might take a moment.</p>
        </div>
      )}

      {error && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto my-8 p-6 bg-destructive/10 border border-destructive/30 rounded-lg text-center"
        >
          <h3 className="text-lg font-semibold text-destructive mb-2">Analysis Failed</h3>
          <p className="text-destructive/80">{error}</p>
        </motion.div>
      )}

      {analysisData && !isLoading && !error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <SearchResultsDisplay analysisData={analysisData} />
        </motion.div>
      )}

      {!analysisData && !isLoading && !error && (
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
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
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-3 rounded-lg w-fit">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
      <Separator className="my-16" />
      <div className="text-center text-muted-foreground text-sm">
        <p>WScrapierr helps you analyze websites, understand their structure, and generate insightful content.</p>
        <p>Powered by cutting-edge AI and web technologies.</p>
      </div>
    </div>
  )
}
