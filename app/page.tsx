"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Search, BarChart, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
// Assuming ResultsSection and LoadingAnimation will be adapted or created
// import { ResultsSection } from "@/components/results-section";
// import { LoadingAnimation } from "@/components/loading-animation";
import type { WebsiteData } from "@/types/website-data" // Assuming this type exists

export default function HomePage() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [analysisData, setAnalysisData] = useState<WebsiteData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
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
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to analyze website.")
      setAnalysisData(data)
      toast({ title: "Analysis Complete!", description: `Successfully analyzed ${url}` })
    } catch (err: any) {
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
    <div className="container mx-auto px-4 py-12 md:py-20 text-center">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            WScrapierr
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Unlock the web's potential. Magically scrape data and generate content with AI-powered intelligence.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-xl mx-auto bg-card p-6 sm:p-8 rounded-xl shadow-2xl border"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="url"
            placeholder="Enter website URL to analyze or scrape..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-12 text-base flex-grow"
            aria-label="Website URL"
          />
          <Button
            size="lg"
            onClick={handleAnalyze}
            disabled={isLoading}
            className="h-12 text-base bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:opacity-90 text-white w-full sm:w-auto"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-5 h-5 border-2 border-background/50 border-t-background rounded-full mr-2"
              />
            ) : (
              <Sparkles className="mr-2 h-5 w-5" />
            )}
            {isLoading ? "Analyzing..." : "Go Magic"}
          </Button>
        </div>
        {error && <p className="text-destructive mt-3 text-sm">{error}</p>}
      </motion.div>

      {/* Placeholder for Results or Loading Animation */}
      {/* {isLoading && <LoadingAnimation />} */}
      {/* {analysisData && <ResultsSection data={analysisData} />} */}

      <motion.div
        className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
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
            <Card className="h-full hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
