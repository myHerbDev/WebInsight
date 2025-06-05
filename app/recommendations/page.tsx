"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Leaf, Zap, Shield, FileText, CheckCircle, Clock, TrendingUp, Lightbulb, Target, BookOpen } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Recommendation {
  id: number
  category: string
  priority: string
  title: string
  description: string
  implementation_steps: string[]
  estimated_impact: string
  estimated_effort: string
  resources: string[]
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    // Load general sustainability recommendations
    setRecommendations(getGeneralRecommendations())
    setLoading(false)
  }, [])

  const getGeneralRecommendations = (): Recommendation[] => {
    return [
      {
        id: 1,
        category: "sustainability",
        priority: "high",
        title: "Choose Green Hosting Providers",
        description:
          "Selecting hosting providers that use renewable energy can significantly reduce your website's carbon footprint. Green hosting providers often use solar, wind, or other renewable energy sources to power their data centers.",
        implementation_steps: [
          "Research hosting providers' environmental policies",
          "Look for certifications like EPA Green Power Partner",
          "Check renewable energy usage percentages",
          "Consider providers with carbon offset programs",
          "Migrate to a green hosting provider",
          "Monitor and report on environmental impact",
        ],
        estimated_impact: "high",
        estimated_effort: "moderate",
        resources: [
          "https://www.thegreenwebfoundation.org/",
          "https://www.websitecarbon.com/",
          "https://sustainablewebdesign.org/",
        ],
      },
      {
        id: 2,
        category: "performance",
        priority: "high",
        title: "Optimize Images and Media",
        description:
          "Large images and media files are major contributors to website carbon emissions. Optimizing these files reduces bandwidth usage and energy consumption.",
        implementation_steps: [
          "Compress images using tools like TinyPNG or ImageOptim",
          "Use modern image formats (WebP, AVIF)",
          "Implement responsive images with srcset",
          "Add lazy loading for images below the fold",
          "Optimize video files and use efficient codecs",
          "Consider using a CDN for media delivery",
        ],
        estimated_impact: "high",
        estimated_effort: "easy",
        resources: ["https://web.dev/fast/#optimize-your-images", "https://tinypng.com/", "https://squoosh.app/"],
      },
      {
        id: 3,
        category: "performance",
        priority: "high",
        title: "Minimize JavaScript and CSS",
        description:
          "Reducing the amount of JavaScript and CSS code decreases file sizes, improves loading times, and reduces energy consumption on both servers and user devices.",
        implementation_steps: [
          "Remove unused JavaScript and CSS code",
          "Minify and compress remaining files",
          "Use tree shaking to eliminate dead code",
          "Implement code splitting for large applications",
          "Use efficient bundling strategies",
          "Consider using a build tool like Webpack or Vite",
        ],
        estimated_impact: "high",
        estimated_effort: "moderate",
        resources: [
          "https://web.dev/remove-unused-code/",
          "https://webpack.js.org/guides/tree-shaking/",
          "https://vitejs.dev/",
        ],
      },
      {
        id: 4,
        category: "sustainability",
        priority: "medium",
        title: "Implement Efficient Caching",
        description:
          "Proper caching reduces server requests and energy consumption by storing frequently accessed content closer to users or in their browsers.",
        implementation_steps: [
          "Set up browser caching with appropriate cache headers",
          "Implement server-side caching (Redis, Memcached)",
          "Use a Content Delivery Network (CDN)",
          "Configure edge caching for static assets",
          "Implement service workers for offline functionality",
          "Monitor cache hit rates and optimize accordingly",
        ],
        estimated_impact: "medium",
        estimated_effort: "moderate",
        resources: [
          "https://web.dev/http-cache/",
          "https://developers.cloudflare.com/cache/",
          "https://web.dev/service-workers-cache-storage/",
        ],
      },
      {
        id: 5,
        category: "security",
        priority: "high",
        title: "Implement Security Best Practices",
        description:
          "Strong security reduces the risk of attacks that can cause excessive server load and energy consumption. It also protects user data and maintains trust.",
        implementation_steps: [
          "Enable HTTPS with a valid SSL certificate",
          "Implement security headers (CSP, HSTS, X-Frame-Options)",
          "Keep software and dependencies updated",
          "Use strong authentication and authorization",
          "Implement rate limiting and DDoS protection",
          "Regular security audits and monitoring",
        ],
        estimated_impact: "high",
        estimated_effort: "moderate",
        resources: [
          "https://owasp.org/www-project-top-ten/",
          "https://securityheaders.com/",
          "https://observatory.mozilla.org/",
        ],
      },
      {
        id: 6,
        category: "content",
        priority: "medium",
        title: "Optimize Content Strategy",
        description:
          "Efficient content management reduces storage needs and improves user experience, leading to lower energy consumption and better engagement.",
        implementation_steps: [
          "Audit and remove outdated or duplicate content",
          "Optimize content for search engines (SEO)",
          "Use efficient content management systems",
          "Implement content compression (Gzip, Brotli)",
          "Optimize database queries and structure",
          "Use efficient content delivery strategies",
        ],
        estimated_impact: "medium",
        estimated_effort: "easy",
        resources: [
          "https://web.dev/content-optimization/",
          "https://developers.google.com/search/docs",
          "https://web.dev/compression/",
        ],
      },
      {
        id: 7,
        category: "sustainability",
        priority: "medium",
        title: "Monitor and Measure Impact",
        description:
          "Regular monitoring helps identify areas for improvement and tracks progress toward sustainability goals.",
        implementation_steps: [
          "Set up website carbon footprint monitoring",
          "Use tools like Website Carbon Calculator",
          "Implement performance monitoring",
          "Track energy usage metrics",
          "Set sustainability goals and KPIs",
          "Regular reporting and optimization",
        ],
        estimated_impact: "medium",
        estimated_effort: "easy",
        resources: [
          "https://www.websitecarbon.com/",
          "https://ecograder.com/",
          "https://sustainablewebdesign.org/calculating-digital-emissions/",
        ],
      },
      {
        id: 8,
        category: "performance",
        priority: "medium",
        title: "Optimize Database Performance",
        description:
          "Efficient database operations reduce server load and energy consumption while improving user experience.",
        implementation_steps: [
          "Optimize database queries and indexes",
          "Implement database connection pooling",
          "Use database caching strategies",
          "Regular database maintenance and cleanup",
          "Consider database sharding for large datasets",
          "Monitor database performance metrics",
        ],
        estimated_impact: "medium",
        estimated_effort: "moderate",
        resources: [
          "https://use-the-index-luke.com/",
          "https://www.postgresql.org/docs/current/performance-tips.html",
          "https://dev.mysql.com/doc/refman/8.0/en/optimization.html",
        ],
      },
    ]
  }

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
        return "text-gray-600"
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

  const filteredRecommendations =
    selectedCategory === "all" ? recommendations : recommendations.filter((r) => r.category === selectedCategory)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p>Loading recommendations...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Sustainability Recommendations</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Comprehensive guide to improving your website's environmental impact, performance, and security. Follow these
          evidence-based recommendations to create a more sustainable web presence.
        </p>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="sustainability">
              <Leaf className="h-4 w-4 mr-2" />
              Sustainability
            </TabsTrigger>
            <TabsTrigger value="performance">
              <Zap className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="content">
              <FileText className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory}>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{filteredRecommendations.length}</div>
                  <div className="text-sm text-gray-500">Total Recommendations</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {filteredRecommendations.filter((r) => r.priority === "high").length}
                  </div>
                  <div className="text-sm text-gray-500">High Priority</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredRecommendations.filter((r) => r.estimated_impact === "high").length}
                  </div>
                  <div className="text-sm text-gray-500">High Impact</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredRecommendations.filter((r) => r.estimated_effort === "easy").length}
                  </div>
                  <div className="text-sm text-gray-500">Easy to Implement</div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRecommendations.map((recommendation) => {
                const CategoryIcon = getCategoryIcon(recommendation.category)

                return (
                  <Card key={recommendation.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                            <CategoryIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-2">
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
                      <p className="text-gray-600 dark:text-gray-400">{recommendation.description}</p>

                      {/* Impact and Effort */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Target className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">Impact</span>
                          </div>
                          <span className={`text-sm font-bold ${getImpactColor(recommendation.estimated_impact)}`}>
                            {recommendation.estimated_impact}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">Effort</span>
                          </div>
                          <span className="text-sm font-bold text-gray-600">{recommendation.estimated_effort}</span>
                        </div>
                      </div>

                      {/* Implementation Steps */}
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Implementation Steps
                        </h4>
                        <ol className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          {recommendation.implementation_steps.slice(0, 3).map((step, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-purple-600 font-medium">{index + 1}.</span>
                              {step}
                            </li>
                          ))}
                          {recommendation.implementation_steps.length > 3 && (
                            <li className="text-purple-600 text-xs">
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
                                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 block truncate"
                              >
                                {resource}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button className="w-full" variant="outline">
                        View Detailed Guide
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Start Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Quick Start Guide to Website Sustainability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-green-600">🌱 Week 1: Foundation</h4>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Measure current carbon footprint</li>
                <li>• Optimize images and media files</li>
                <li>• Enable HTTPS and basic security</li>
                <li>• Set up performance monitoring</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-blue-600">⚡ Week 2-3: Optimization</h4>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Implement caching strategies</li>
                <li>• Minimize JavaScript and CSS</li>
                <li>• Research green hosting options</li>
                <li>• Optimize database performance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-purple-600">🚀 Week 4+: Advanced</h4>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Migrate to green hosting</li>
                <li>• Implement advanced security</li>
                <li>• Set up continuous monitoring</li>
                <li>• Create sustainability reports</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
