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
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
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
