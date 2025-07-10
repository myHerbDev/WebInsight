"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Leaf,
  Zap,
  Shield,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Lightbulb,
  Target,
  BookOpen,
  Award,
  TreePine,
  Sparkles,
  Download,
  Share2,
} from "lucide-react"
import { Logo } from "@/components/logo"
import Link from "next/link"

interface Recommendation {
  id: number
  category: string
  priority: "high" | "medium" | "low"
  title: string
  description: string
  implementation_steps: string[]
  estimated_impact: "high" | "medium" | "low"
  estimated_effort: "easy" | "moderate" | "hard"
  resources: string[]
  carbon_reduction?: string
  cost_savings?: string
  timeframe?: string
}

const COMPREHENSIVE_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 1,
    category: "sustainability",
    priority: "high",
    title: "Switch to Green Hosting",
    description:
      "Migrate to a hosting provider that uses 100% renewable energy. This single change can reduce your website's carbon footprint by up to 70%.",
    implementation_steps: [
      "Research green hosting providers from our catalog",
      "Compare renewable energy percentages and certifications",
      "Plan migration timeline to minimize downtime",
      "Backup all website data before migration",
      "Update DNS settings and test functionality",
      "Monitor performance after migration",
    ],
    estimated_impact: "high",
    estimated_effort: "moderate",
    resources: ["https://www.thegreenwebfoundation.org/", "https://www.websitecarbon.com/", "/hosting"],
    carbon_reduction: "Up to 70% reduction",
    cost_savings: "$50-200/year",
    timeframe: "1-2 weeks",
  },
  {
    id: 2,
    category: "performance",
    priority: "high",
    title: "Optimize Images for Web",
    description:
      "Compress and convert images to modern formats like WebP and AVIF. Images often account for 60-80% of a webpage's total size.",
    implementation_steps: [
      "Audit current images using tools like Google PageSpeed Insights",
      "Compress existing images using TinyPNG or ImageOptim",
      "Convert images to WebP format with fallbacks",
      "Implement responsive images with srcset",
      "Add lazy loading for images below the fold",
      "Set up automated image optimization in your workflow",
    ],
    estimated_impact: "high",
    estimated_effort: "moderate",
    resources: ["https://tinypng.com/", "https://squoosh.app/", "https://web.dev/fast/#optimize-your-images"],
    carbon_reduction: "30-50% reduction",
    cost_savings: "$20-100/month in bandwidth",
    timeframe: "2-3 days",
  },
  {
    id: 3,
    category: "performance",
    priority: "high",
    title: "Implement Content Delivery Network (CDN)",
    description:
      "Use a CDN to serve content from servers closer to your users, reducing data transfer distances and energy consumption.",
    implementation_steps: [
      "Choose a green CDN provider (Cloudflare, KeyCDN)",
      "Configure CDN for static assets (images, CSS, JS)",
      "Set up proper cache headers",
      "Enable compression (Gzip/Brotli)",
      "Test performance improvements",
      "Monitor CDN analytics and optimize",
    ],
    estimated_impact: "high",
    estimated_effort: "easy",
    resources: ["https://www.cloudflare.com/", "https://www.keycdn.com/", "https://web.dev/content-delivery-networks/"],
    carbon_reduction: "20-40% reduction",
    cost_savings: "$10-50/month",
    timeframe: "1 day",
  },
  {
    id: 4,
    category: "sustainability",
    priority: "medium",
    title: "Minimize JavaScript and CSS",
    description: "Reduce the amount of JavaScript and CSS code to decrease file sizes and processing requirements.",
    implementation_steps: [
      "Audit unused CSS and JavaScript",
      "Remove unnecessary libraries and plugins",
      "Minify and compress remaining files",
      "Implement code splitting for large applications",
      "Use tree shaking to eliminate dead code",
      "Consider using lighter alternatives to heavy frameworks",
    ],
    estimated_impact: "medium",
    estimated_effort: "moderate",
    resources: [
      "https://web.dev/remove-unused-code/",
      "https://webpack.js.org/guides/tree-shaking/",
      "https://bundlephobia.com/",
    ],
    carbon_reduction: "15-25% reduction",
    cost_savings: "$15-75/month",
    timeframe: "3-5 days",
  },
  {
    id: 5,
    category: "security",
    priority: "high",
    title: "Implement Security Best Practices",
    description:
      "Strong security prevents attacks that can cause excessive server load and energy consumption while protecting user data.",
    implementation_steps: [
      "Enable HTTPS with a valid SSL certificate",
      "Implement security headers (CSP, HSTS, X-Frame-Options)",
      "Keep all software and dependencies updated",
      "Use strong authentication and authorization",
      "Implement rate limiting and DDoS protection",
      "Set up regular security audits and monitoring",
    ],
    estimated_impact: "high",
    estimated_effort: "moderate",
    resources: [
      "https://owasp.org/www-project-top-ten/",
      "https://securityheaders.com/",
      "https://observatory.mozilla.org/",
    ],
    carbon_reduction: "Prevents energy waste from attacks",
    cost_savings: "Prevents costly security breaches",
    timeframe: "1-2 weeks",
  },
  {
    id: 6,
    category: "performance",
    priority: "medium",
    title: "Optimize Database Queries",
    description:
      "Efficient database operations reduce server load and energy consumption while improving user experience.",
    implementation_steps: [
      "Analyze slow queries using database profiling tools",
      "Add appropriate indexes to frequently queried columns",
      "Implement database connection pooling",
      "Use database caching strategies (Redis, Memcached)",
      "Optimize query structure and eliminate N+1 problems",
      "Regular database maintenance and cleanup",
    ],
    estimated_impact: "medium",
    estimated_effort: "moderate",
    resources: [
      "https://use-the-index-luke.com/",
      "https://www.postgresql.org/docs/current/performance-tips.html",
      "https://redis.io/",
    ],
    carbon_reduction: "10-20% reduction",
    cost_savings: "$25-150/month",
    timeframe: "1-2 weeks",
  },
  {
    id: 7,
    category: "sustainability",
    priority: "medium",
    title: "Implement Efficient Caching",
    description:
      "Proper caching reduces server requests and energy consumption by storing frequently accessed content.",
    implementation_steps: [
      "Set up browser caching with appropriate cache headers",
      "Implement server-side caching (Redis, Memcached)",
      "Configure edge caching for static assets",
      "Implement service workers for offline functionality",
      "Use cache invalidation strategies",
      "Monitor cache hit rates and optimize accordingly",
    ],
    estimated_impact: "medium",
    estimated_effort: "moderate",
    resources: [
      "https://web.dev/http-cache/",
      "https://developers.cloudflare.com/cache/",
      "https://web.dev/service-workers-cache-storage/",
    ],
    carbon_reduction: "15-30% reduction",
    cost_savings: "$20-100/month",
    timeframe: "3-7 days",
  },
  {
    id: 8,
    category: "content",
    priority: "medium",
    title: "Optimize Content Strategy",
    description:
      "Efficient content management reduces storage needs and improves user experience, leading to lower energy consumption.",
    implementation_steps: [
      "Audit and remove outdated or duplicate content",
      "Optimize content for search engines (SEO)",
      "Implement content compression (Gzip, Brotli)",
      "Use efficient content management systems",
      "Optimize database queries and structure",
      "Implement content archiving for old data",
    ],
    estimated_impact: "medium",
    estimated_effort: "easy",
    resources: [
      "https://web.dev/content-optimization/",
      "https://developers.google.com/search/docs",
      "https://web.dev/compression/",
    ],
    carbon_reduction: "10-15% reduction",
    cost_savings: "$10-50/month",
    timeframe: "2-4 days",
  },
  {
    id: 9,
    category: "sustainability",
    priority: "low",
    title: "Monitor and Measure Impact",
    description:
      "Regular monitoring helps identify areas for improvement and tracks progress toward sustainability goals.",
    implementation_steps: [
      "Set up website carbon footprint monitoring",
      "Use tools like Website Carbon Calculator",
      "Implement performance monitoring with Core Web Vitals",
      "Track energy usage metrics",
      "Set sustainability goals and KPIs",
      "Create regular reporting and optimization cycles",
    ],
    estimated_impact: "low",
    estimated_effort: "easy",
    resources: [
      "https://www.websitecarbon.com/",
      "https://ecograder.com/",
      "https://sustainablewebdesign.org/calculating-digital-emissions/",
    ],
    carbon_reduction: "Enables ongoing optimization",
    cost_savings: "Identifies cost-saving opportunities",
    timeframe: "1-2 days",
  },
  {
    id: 10,
    category: "performance",
    priority: "low",
    title: "Optimize Font Loading",
    description: "Efficient font loading reduces render-blocking resources and improves page load times.",
    implementation_steps: [
      "Use font-display: swap for web fonts",
      "Preload critical fonts",
      "Subset fonts to include only necessary characters",
      "Use system fonts where appropriate",
      "Implement font fallbacks",
      "Consider variable fonts to reduce file count",
    ],
    estimated_impact: "low",
    estimated_effort: "easy",
    resources: ["https://web.dev/font-display/", "https://fonts.google.com/", "https://web.dev/reduce-webfont-size/"],
    carbon_reduction: "5-10% reduction",
    cost_savings: "$5-25/month",
    timeframe: "1 day",
  },
]

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(COMPREHENSIVE_RECOMMENDATIONS)
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sustainability":
        return Leaf
      case "performance":
        return Zap
      case "security":
        return Shield
      case "content":
        return FileText
      default:
        return Lightbulb
    }
  }

  const filteredRecommendations = recommendations.filter((r) => {
    const categoryMatch = selectedCategory === "all" || r.category === selectedCategory
    const priorityMatch = selectedPriority === "all" || r.priority === selectedPriority
    return categoryMatch && priorityMatch
  })

  const handleExportRecommendations = () => {
    // Create a simple text export
    const exportData = filteredRecommendations
      .map(
        (rec) =>
          `${rec.title}\nPriority: ${rec.priority}\nCategory: ${rec.category}\nDescription: ${rec.description}\nSteps: ${rec.implementation_steps.join(", ")}\n\n`,
      )
      .join("")

    const blob = new Blob([exportData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sustainability-recommendations.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo size="lg" showText={true} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Sustainability Recommendations
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive guide to improving your website's environmental impact, performance, and security. Follow
            these evidence-based recommendations to create a more sustainable web presence.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Button
              onClick={handleExportRecommendations}
              className="bg-gradient-to-r from-green-500 to-blue-600 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Recommendations
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share Guide
            </Button>
          </div>
        </div>

        {/* Quick Impact Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
            <CardContent className="p-6 text-center">
              <TreePine className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">70%</div>
              <div className="text-sm text-gray-500">Max Carbon Reduction</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">$500+</div>
              <div className="text-sm text-gray-500">Annual Savings</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">2-3 weeks</div>
              <div className="text-sm text-gray-500">Implementation Time</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{recommendations.length}</div>
              <div className="text-sm text-gray-500">Total Recommendations</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="text-sm font-medium mb-2 block">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white dark:bg-slate-800"
              >
                <option value="all">All Categories</option>
                <option value="sustainability">Sustainability</option>
                <option value="performance">Performance</option>
                <option value="security">Security</option>
                <option value="content">Content</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Priority:</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white dark:bg-slate-800"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            <div className="ml-auto">
              <span className="text-sm text-gray-500">
                Showing {filteredRecommendations.length} of {recommendations.length} recommendations
              </span>
            </div>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{filteredRecommendations.length}</div>
              <div className="text-sm text-gray-500">Total Recommendations</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredRecommendations.filter((r) => r.priority === "high").length}
              </div>
              <div className="text-sm text-gray-500">High Priority</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredRecommendations.filter((r) => r.estimated_impact === "high").length}
              </div>
              <div className="text-sm text-gray-500">High Impact</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredRecommendations.filter((r) => r.estimated_effort === "easy").length}
              </div>
              <div className="text-sm text-gray-500">Easy to Implement</div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {filteredRecommendations.map((recommendation) => {
            const CategoryIcon = getCategoryIcon(recommendation.category)

            return (
              <Card
                key={recommendation.id}
                className="hover:shadow-xl transition-all duration-300 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900">
                        <CategoryIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{recommendation.title}</CardTitle>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getPriorityColor(recommendation.priority)}>
                            {recommendation.priority} priority
                          </Badge>
                          <Badge variant="outline">{recommendation.category}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{recommendation.description}</p>

                  {/* Impact Metrics */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Target className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-sm font-medium">Impact</span>
                      </div>
                      <span className={`text-sm font-bold ${getImpactColor(recommendation.estimated_impact)}`}>
                        {recommendation.estimated_impact}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-sm font-medium">Effort</span>
                      </div>
                      <span className="text-sm font-bold text-gray-600">{recommendation.estimated_effort}</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <TrendingUp className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-sm font-medium">Time</span>
                      </div>
                      <span className="text-sm font-bold text-blue-600">{recommendation.timeframe}</span>
                    </div>
                  </div>

                  {/* Benefits */}
                  {(recommendation.carbon_reduction || recommendation.cost_savings) && (
                    <div className="grid grid-cols-2 gap-4">
                      {recommendation.carbon_reduction && (
                        <div className="flex items-center text-sm">
                          <TreePine className="h-4 w-4 mr-2 text-green-500" />
                          <span>{recommendation.carbon_reduction}</span>
                        </div>
                      )}
                      {recommendation.cost_savings && (
                        <div className="flex items-center text-sm">
                          <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{recommendation.cost_savings}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Implementation Steps */}
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Implementation Steps
                    </h4>
                    <ol className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {recommendation.implementation_steps.slice(0, 3).map((step, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 font-medium min-w-[20px]">{index + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                      {recommendation.implementation_steps.length > 3 && (
                        <li className="text-green-600 text-xs ml-6">
                          +{recommendation.implementation_steps.length - 3} more steps
                        </li>
                      )}
                    </ol>
                  </div>

                  {/* Resources */}
                  {recommendation.resources.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-500" />
                        Resources
                      </h4>
                      <div className="space-y-1">
                        {recommendation.resources.slice(0, 2).map((resource, index) => (
                          <a
                            key={index}
                            href={resource}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 block truncate hover:underline"
                          >
                            {resource}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button className="w-full bg-transparent" variant="outline">
                    <Sparkles className="h-4 w-4 mr-2" />
                    View Detailed Guide
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Implementation Roadmap */}
        <Card className="mb-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-500" />
              Implementation Roadmap
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Follow this step-by-step plan to maximize your sustainability improvements.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Phase 1: Quick Wins */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-600 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Phase 1: Quick Wins (Week 1)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations
                    .filter((rec) => rec.priority === "high" && rec.estimated_effort === "easy")
                    .map((rec) => (
                      <div
                        key={rec.id}
                        className="flex items-start p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800"
                      >
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-sm">{rec.title}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {rec.carbon_reduction} • {rec.timeframe}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Phase 2: Medium-term Goals */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-600 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Phase 2: Medium-term Goals (Weeks 2-4)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations
                    .filter(
                      (rec) =>
                        rec.priority === "medium" || (rec.priority === "high" && rec.estimated_effort === "moderate"),
                    )
                    .slice(0, 4)
                    .map((rec) => (
                      <div
                        key={rec.id}
                        className="flex items-start p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
                      >
                        <Target className="h-5 w-5 text-blue-600 mr-3 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-sm">{rec.title}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {rec.carbon_reduction} • {rec.timeframe}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Phase 3: Long-term Optimization */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-purple-600 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Phase 3: Long-term Optimization (Month 2+)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations
                    .filter((rec) => rec.estimated_effort === "hard" || rec.priority === "low")
                    .slice(0, 4)
                    .map((rec) => (
                      <div
                        key={rec.id}
                        className="flex items-start p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800"
                      >
                        <Sparkles className="h-5 w-5 text-purple-600 mr-3 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-sm">{rec.title}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {rec.carbon_reduction} • {rec.timeframe}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Total Potential Impact */}
              <div className="mt-8 p-6 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg text-white">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Total Potential Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <div className="text-2xl font-bold">70%</div>
                      <div className="text-sm opacity-90">Carbon Reduction</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">$500+</div>
                      <div className="text-sm opacity-90">Annual Savings</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">50%</div>
                      <div className="text-sm opacity-90">Performance Boost</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Start implementing these recommendations today and join the movement towards a more sustainable web. Every
              small change contributes to a greener digital future.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                <Link href="/hosting">
                  <Leaf className="h-4 w-4 mr-2" />
                  Browse Green Hosting
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                <Link href="/">
                  <Zap className="h-4 w-4 mr-2" />
                  Analyze Your Website
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
