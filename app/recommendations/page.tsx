"use client"

import { cn } from "@/lib/utils"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, AlertTriangle, Zap, Shield, Leaf, FileText, Search, Loader2, ExternalLink } from "lucide-react" // Added ExternalLink
import { Button } from "@/components/ui/button"
import Link from "next/link"

// This would typically come from your types definition
interface Recommendation {
  id: string // or number
  analysis_id?: string
  category: "performance" | "security" | "sustainability" | "content" | "seo" | "general"
  priority: "high" | "medium" | "low"
  title: string
  description: string
  implementation_steps: string[]
  estimated_impact: "high" | "medium" | "low"
  estimated_effort: "high" | "medium" | "low" | "easy" | "moderate" // Allow for more descriptive terms
  resources?: string[]
  created_at: string // ISO date string
}

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    category: "performance",
    priority: "high",
    title: "Optimize Image Delivery",
    description:
      "Large, unoptimized images significantly slow down page load times. Serve images in next-gen formats like WebP and use responsive images.",
    implementation_steps: [
      "Compress all JPEG and PNG images.",
      "Convert images to WebP format where browser support allows.",
      "Implement <picture> element or srcset attribute for responsive images.",
      "Lazy-load offscreen images.",
    ],
    estimated_impact: "high",
    estimated_effort: "moderate",
    resources: ["https://web.dev/fast/", "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture"],
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    category: "security",
    priority: "medium",
    title: "Implement Content Security Policy (CSP)",
    description:
      "A CSP helps to detect and mitigate certain types of attacks, including Cross-Site Scripting (XSS) and data injection.",
    implementation_steps: [
      "Define a strict policy for allowed sources of content (scripts, styles, images).",
      "Start with a report-only mode to identify violations.",
      "Gradually enforce the policy.",
      "Use a nonce or hash for inline scripts if unavoidable.",
    ],
    estimated_impact: "high",
    estimated_effort: "moderate",
    resources: ["https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP", "https://csp-evaluator.withgoogle.com/"],
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    category: "sustainability",
    priority: "medium", // Elevated priority for emphasis
    title: "Choose a Green Hosting Provider",
    description:
      "Selecting a hosting provider that uses renewable energy or purchases carbon offsets can significantly reduce your website's carbon footprint. This is a key step towards digital sustainability.",
    implementation_steps: [
      "Research hosting providers and their commitment to renewable energy.",
      "Check for certifications like Green Power Partner or B Corp.",
      "Consider providers that purchase Renewable Energy Certificates (RECs) or invest in carbon offset projects.",
      "Evaluate their overall sustainability reports and transparency.",
    ],
    estimated_impact: "high", // Impact is high for sustainability
    estimated_effort: "easy", // If migrating, could be high, but choosing initially is easy
    resources: ["https://www.thegreenwebfoundation.org/", "/hosting?filter=green"], // Added link to our hosting page
    created_at: new Date().toISOString(),
  },
  // Add more mock recommendations as needed
]

const categoryIcons = {
  performance: <Zap className="h-5 w-5 text-yellow-500" />,
  security: <Shield className="h-5 w-5 text-blue-500" />,
  sustainability: <Leaf className="h-5 w-5 text-green-500" />,
  content: <FileText className="h-5 w-5 text-purple-500" />,
  seo: <Search className="h-5 w-5 text-orange-500" />,
  general: <Lightbulb className="h-5 w-5 text-gray-500" />,
}

const priorityColors: Record<Recommendation["priority"], string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400",
  low: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400",
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, fetch recommendations from an API
    setTimeout(() => {
      setRecommendations(mockRecommendations)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-brand-DEFAULT mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading recommendations...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <Lightbulb className="h-12 w-12 text-brand-DEFAULT mx-auto mb-3" />
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-800 dark:text-slate-200">
              Optimization Recommendations
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-md">
              Actionable insights to improve your website's performance, security, and sustainability.
            </p>
          </div>

          {recommendations.length === 0 && !loading && (
            <Card className="text-center py-12">
              <CardContent>
                <AlertTriangle className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 dark:text-slate-400">No recommendations available at the moment.</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                  Analyze a website to get personalized recommendations.
                </p>
                <Button asChild className="mt-4 bg-brand-DEFAULT hover:bg-brand-dark text-white">
                  <Link href="/">Analyze a Website</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            {recommendations.map((rec) => {
              const isGreenHostingRec =
                rec.category === "sustainability" && rec.title.toLowerCase().includes("green hosting")
              return (
                <Card
                  key={rec.id}
                  className={cn(
                    "bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow",
                    isGreenHostingRec &&
                      "border-green-500/50 dark:border-green-400/40 ring-2 ring-green-500/30 dark:ring-green-400/30 bg-green-50/30 dark:bg-green-900/20",
                  )}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        {categoryIcons[rec.category]}
                        <CardTitle className="text-xl text-slate-800 dark:text-slate-200">{rec.title}</CardTitle>
                      </div>
                      <Badge className={cn("capitalize", priorityColors[rec.priority])}>{rec.priority}</Badge>
                    </div>
                    <CardDescription className="pt-1 text-slate-600 dark:text-slate-400">
                      {rec.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-1 text-slate-700 dark:text-slate-300">
                        Implementation Steps:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        {rec.implementation_steps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Impact: </span>
                        <Badge variant="outline" className="capitalize border-slate-300 dark:border-slate-700">
                          {rec.estimated_impact}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Effort: </span>
                        <Badge variant="outline" className="capitalize border-slate-300 dark:border-slate-700">
                          {rec.estimated_effort}
                        </Badge>
                      </div>
                    </div>
                    {rec.resources && rec.resources.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-sm mb-1 text-slate-700 dark:text-slate-300">Resources:</h4>
                        <ul className="space-y-1 text-sm">
                          {rec.resources.map((link, i) => (
                            <li key={i}>
                              <Link
                                href={link}
                                target={link.startsWith("http") ? "_blank" : "_self"}
                                rel={link.startsWith("http") ? "noopener noreferrer" : ""}
                                className="text-brand-DEFAULT hover:underline dark:text-brand-light flex items-center"
                              >
                                {link.length > 60 ? link.substring(0, 57) + "..." : link}
                                {link.startsWith("http") && <ExternalLink className="h-3 w-3 ml-1 opacity-70" />}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {isGreenHostingRec && (
                      <Button asChild className="mt-2 bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                        <Link href="/hosting?filter=green&utm_source=recommendations">
                          <Leaf className="h-4 w-4 mr-2" /> Explore Green Hosting Providers
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
