"use client"

import { cn } from "@/lib/utils"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, AlertTriangle, Zap, Shield, Leaf } from "lucide-react"
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
    priority: "low",
    title: "Choose a Green Hosting Provider",
    description:
      "Selecting a hosting provider that uses renewable energy can significantly reduce your website's carbon footprint.",
    implementation_steps: [
      "Research hosting providers and their energy sources.",
      "Check for certifications like Green Power Partner.",
      "Consider providers that purchase Renewable Energy Certificates (RECs).",
    ],
    estimated_impact: "medium",
    estimated_effort: "easy", // If migrating, could be high
    resources: ["https://www.thegreenwebfoundation.org/"],
    created_at: new Date().toISOString(),
  },
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
    // In a real app, fetch recommendations from an API:
    // e.g., fetch('/api/recommendations?analysisId=...')
    // For now, using mock data
    setTimeout(() => {
      // Simulate API delay
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
            {recommendations.map((rec) => (
              <Card
                key={rec.id}
                className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
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
                    <div>
                      <h4 className="font-medium text-sm mb-1 text-slate-700 dark:text-slate-300">Resources:</h4>
                      <ul className="space-y-1 text-sm">
                        {rec.resources.map((link, i) => (
                          <li key={i}>
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-DEFAULT hover:underline dark:text-brand-light"
                            >
                              {link.length > 60 ? link.substring(0, 57) + "..." : link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
