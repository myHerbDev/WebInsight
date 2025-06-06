"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GoogleResultsCard } from "@/components/google-results-card"
import { GoogleMetricsGrid } from "@/components/google-metrics-grid"
import { SustainabilityChart } from "@/components/sustainability-chart"
import { SustainabilityRankBox } from "@/components/sustainability-rank-box"
import { AnalyticsGraphic } from "@/components/analytics-graphic"
import { SocialShare } from "@/components/social-share"
import { EnhancedAIGenerator } from "@/components/enhanced-ai-generator"
import { SignUpModal } from "@/components/sign-up-modal"
import { LoginModal } from "@/components/login-modal"
import { ContentTypeGenerator } from "@/components/content-type-generator"
import { ContentExport } from "@/components/content-export"
import {
  BarChart3,
  Leaf,
  Globe,
  Zap,
  Search,
  FileText,
  Server,
  Share2,
  Download,
  ChevronRight,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react"
import type { WebsiteData } from "@/types/website-data"

interface ResultsSectionProps {
  data: WebsiteData
}

export function ResultsSection({ data }: ResultsSectionProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Safely extract scores with fallbacks
  const performanceScore = Math.round(data?.performance_score || data?.sustainability?.performance || 0)
  const sustainabilityScore = Math.round(data?.sustainability_score || data?.sustainability?.score || 0)
  const securityScore = Math.round(data?.security_score || 85)
  const seoScore = Math.round(data?.seo_score || 78)

  // Handle null or undefined data
  if (!data) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Analysis Data Available</h3>
        <p className="text-gray-600 mb-4">Please analyze a website to see results.</p>
      </div>
    )
  }

  const handleSignUpClick = () => {
    setShowSignUpModal(true)
  }

  const handleLoginClick = () => {
    setShowLoginModal(true)
  }

  return (
    <div className="space-y-8">
      {/* Website Title and URL */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{data.title || data.url}</h1>
        <div className="flex items-center text-gray-600">
          <Globe className="h-4 w-4 mr-2" />
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center"
          >
            {data.url} <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </div>

      {/* Google-style Results Card */}
      <GoogleResultsCard analysisData={data} />

      {/* Metrics Grid */}
      <GoogleMetricsGrid analysisData={data} />

      {/* Main Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Overview</span>
            <span className="sm:hidden">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="sustainability" className="flex items-center">
            <Leaf className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Sustainability</span>
            <span className="sm:hidden">Green</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Performance</span>
            <span className="sm:hidden">Speed</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center">
            <Search className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">SEO</span>
            <span className="sm:hidden">SEO</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Content</span>
            <span className="sm:hidden">Content</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Performance Summary
                </CardTitle>
                <CardDescription>Key metrics and scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Performance</span>
                      <Badge
                        variant={performanceScore > 80 ? "success" : performanceScore > 50 ? "warning" : "destructive"}
                      >
                        {performanceScore}/100
                      </Badge>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          performanceScore > 80 ? "bg-green-500" : performanceScore > 50 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${performanceScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Sustainability</span>
                      <Badge
                        variant={
                          sustainabilityScore > 80 ? "success" : sustainabilityScore > 50 ? "warning" : "destructive"
                        }
                      >
                        {sustainabilityScore}/100
                      </Badge>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          sustainabilityScore > 80
                            ? "bg-green-500"
                            : sustainabilityScore > 50
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${sustainabilityScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Security</span>
                      <Badge variant={securityScore > 80 ? "success" : securityScore > 50 ? "warning" : "destructive"}>
                        {securityScore}/100
                      </Badge>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          securityScore > 80 ? "bg-green-500" : securityScore > 50 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${securityScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">SEO</span>
                      <Badge variant={seoScore > 80 ? "success" : seoScore > 50 ? "warning" : "destructive"}>
                        {seoScore}/100
                      </Badge>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          seoScore > 80 ? "bg-green-500" : seoScore > 50 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${seoScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-600" />
                  Website Information
                </CardTitle>
                <CardDescription>Technical details and hosting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Server Location</p>
                      <p className="font-medium">{data.server_location || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Hosting Provider</p>
                      <p className="font-medium">{data.hosting_provider_name || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">SSL Certificate</p>
                      <div className="flex items-center">
                        {data.ssl_certificate ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-700">Valid</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-500 mr-1" />
                            <span className="text-red-700">Not Found</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Response Time</p>
                      <p className="font-medium">{data.response_time ? `${data.response_time}ms` : "Unknown"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Technologies</p>
                    <div className="flex flex-wrap gap-2">
                      {data.technologies && data.technologies.length > 0 ? (
                        data.technologies.slice(0, 5).map((tech, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-100">
                            {tech}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No technologies detected</span>
                      )}
                      {data.technologies && data.technologies.length > 5 && (
                        <Badge variant="outline" className="bg-gray-100">
                          +{data.technologies.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-blue-600" />
                Quick Actions
              </CardTitle>
              <CardDescription>Generate content and export results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => setActiveTab("content")}
                  className="flex items-center justify-center h-auto py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <div className="text-center">
                    <FileText className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Generate AI Content</span>
                    <p className="text-xs mt-1 opacity-80">Create SEO-optimized content</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center justify-center h-auto py-6"
                  onClick={() =>
                    window.open(
                      `https://search.google.com/test/mobile-friendly?url=${encodeURIComponent(data.url)}`,
                      "_blank",
                    )
                  }
                >
                  <div className="text-center">
                    <Search className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <span className="text-sm font-medium text-gray-800">Test Mobile Friendly</span>
                    <p className="text-xs mt-1 text-gray-500">Check Google's assessment</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center justify-center h-auto py-6"
                  onClick={() =>
                    window.open(
                      `https://developers.google.com/speed/pagespeed/insights/?url=${encodeURIComponent(data.url)}`,
                      "_blank",
                    )
                  }
                >
                  <div className="text-center">
                    <Zap className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <span className="text-sm font-medium text-gray-800">PageSpeed Insights</span>
                    <p className="text-xs mt-1 text-gray-500">Check detailed performance</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Key Insights</h3>
            <Button variant="ghost" size="sm" className="text-blue-600">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.insights && data.insights.length > 0 ? (
              data.insights.slice(0, 4).map((insight, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-2 rounded-full ${
                          insight.type === "success"
                            ? "bg-green-100"
                            : insight.type === "warning"
                              ? "bg-amber-100"
                              : insight.type === "error"
                                ? "bg-red-100"
                                : "bg-blue-100"
                        }`}
                      >
                        {insight.type === "success" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : insight.type === "warning" ? (
                          <AlertTriangle className="h-5 w-5 text-amber-600" />
                        ) : insight.type === "error" ? (
                          <XCircle className="h-5 w-5 text-red-600" />
                        ) : (
                          <Info className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{insight.title}</h4>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="md:col-span-2">
                <CardContent className="p-6 text-center">
                  <Info className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-medium mb-1">No insights available</h4>
                  <p className="text-sm text-gray-600">We're still analyzing this website for detailed insights.</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" className="flex items-center">
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </Button>
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </TabsContent>

        {/* Sustainability Tab */}
        <TabsContent value="sustainability" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="h-5 w-5 mr-2 text-green-600" />
                  Sustainability Score
                </CardTitle>
                <CardDescription>Environmental impact assessment</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <SustainabilityChart data={data} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="h-5 w-5 mr-2 text-green-600" />
                  Green Ranking
                </CardTitle>
                <CardDescription>How this site compares</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <SustainabilityRankBox score={sustainabilityScore} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="h-5 w-5 mr-2 text-green-600" />
                Hosting Information
              </CardTitle>
              <CardDescription>Server location and provider details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Server Location</h4>
                  <p className="text-gray-600">{data.server_location || "Unknown"}</p>

                  <h4 className="font-medium mt-4 mb-2">Hosting Provider</h4>
                  <p className="text-gray-600">{data.hosting_provider_name || "Unknown"}</p>

                  <h4 className="font-medium mt-4 mb-2">Green Hosting</h4>
                  <div className="flex items-center">
                    {data.green_hosting ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-green-700">Yes - Uses renewable energy</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                        <span className="text-amber-700">Unknown or non-green hosting</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium mb-2">Sustainability Recommendations</h4>
                  <ul className="space-y-2">
                    {data.sustainability?.improvements ? (
                      data.sustainability.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{improvement}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">Optimize images to reduce data transfer</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">Implement efficient caching strategies</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">Consider switching to a green hosting provider</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-blue-600" />
                Performance Metrics
              </CardTitle>
              <CardDescription>Loading speed and optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <AnalyticsGraphic data={data} />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">First Contentful Paint</span>
                      <Badge variant={data.fcp < 1.8 ? "success" : data.fcp < 3 ? "warning" : "destructive"}>
                        {data.fcp ? `${data.fcp.toFixed(2)}s` : "Unknown"}
                      </Badge>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          data.fcp < 1.8 ? "bg-green-500" : data.fcp < 3 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(100, (data.fcp || 0) * 20)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Largest Contentful Paint</span>
                      <Badge variant={data.lcp < 2.5 ? "success" : data.lcp < 4 ? "warning" : "destructive"}>
                        {data.lcp ? `${data.lcp.toFixed(2)}s` : "Unknown"}
                      </Badge>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          data.lcp < 2.5 ? "bg-green-500" : data.lcp < 4 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(100, (data.lcp || 0) * 15)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Cumulative Layout Shift</span>
                      <Badge variant={data.cls < 0.1 ? "success" : data.cls < 0.25 ? "warning" : "destructive"}>
                        {data.cls ? data.cls.toFixed(3) : "Unknown"}
                      </Badge>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          data.cls < 0.1 ? "bg-green-500" : data.cls < 0.25 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(100, (data.cls || 0) * 300)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Time to Interactive</span>
                      <Badge variant={data.tti < 3.8 ? "success" : data.tti < 7.3 ? "warning" : "destructive"}>
                        {data.tti ? `${data.tti.toFixed(2)}s` : "Unknown"}
                      </Badge>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          data.tti < 3.8 ? "bg-green-500" : data.tti < 7.3 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(100, (data.tti || 0) * 8)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-blue-600" />
                Performance Recommendations
              </CardTitle>
              <CardDescription>Actionable steps to improve speed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.performance_recommendations ? (
                  data.performance_recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Zap className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{recommendation.title}</h4>
                        <p className="text-sm text-gray-600">{recommendation.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Zap className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Optimize Images</h4>
                        <p className="text-sm text-gray-600">Compress and properly size images to reduce load times.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Zap className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Enable Browser Caching</h4>
                        <p className="text-sm text-gray-600">Set appropriate cache headers to improve repeat visits.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Zap className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Minimize Render-Blocking Resources</h4>
                        <p className="text-sm text-gray-600">Defer non-critical JavaScript and CSS loading.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2 text-blue-600" />
                SEO Analysis
              </CardTitle>
              <CardDescription>Search engine optimization assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Meta Information</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Title Tag</p>
                        <div className="flex items-center">
                          {data.metaTags?.title ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <p className="text-sm">{data.metaTags.title}</p>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-500 mr-2" />
                              <p className="text-sm text-red-600">Missing title tag</p>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">Meta Description</p>
                        <div className="flex items-center">
                          {data.metaTags?.description ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <p className="text-sm">{data.metaTags.description}</p>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-500 mr-2" />
                              <p className="text-sm text-red-600">Missing meta description</p>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">Meta Keywords</p>
                        <div className="flex items-center">
                          {data.metaTags?.keywords ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <p className="text-sm">{data.metaTags.keywords}</p>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                              <p className="text-sm text-amber-600">No meta keywords (less important nowadays)</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Content Analysis</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Headings Structure</p>
                        <div className="flex items-center">
                          {data.headings?.h1?.length > 0 ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <p className="text-sm">
                                {data.headings.h1.length} H1, {data.headings?.h2?.length || 0} H2,{" "}
                                {data.headings?.h3?.length || 0} H3 tags
                              </p>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-500 mr-2" />
                              <p className="text-sm text-red-600">Missing H1 heading</p>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">Content Length</p>
                        <div className="flex items-center">
                          {data.content?.wordCount > 300 ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <p className="text-sm">{data.content.wordCount} words - Good length</p>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                              <p className="text-sm text-amber-600">
                                {data.content?.wordCount || 0} words - Consider adding more content
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">Image Alt Text</p>
                        <div className="flex items-center">
                          {data.images?.filter((img) => img.alt).length > 0 ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <p className="text-sm">
                                {data.images.filter((img) => img.alt).length} of {data.images.length} images have alt
                                text
                              </p>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-500 mr-2" />
                              <p className="text-sm text-red-600">Missing alt text on images</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Technical SEO</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Mobile Friendly</p>
                        <div className="flex items-center">
                          {data.mobile_friendly ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <p className="text-sm">Site appears mobile friendly</p>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                              <p className="text-sm text-amber-600">Mobile friendliness unknown</p>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">HTTPS</p>
                        <div className="flex items-center">
                          {data.ssl_certificate ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <p className="text-sm">HTTPS implemented correctly</p>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-500 mr-2" />
                              <p className="text-sm text-red-600">Site not using HTTPS</p>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">Robots.txt</p>
                        <div className="flex items-center">
                          {data.robots_txt ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <p className="text-sm">Robots.txt file found</p>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                              <p className="text-sm text-amber-600">No robots.txt file detected</p>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">XML Sitemap</p>
                        <div className="flex items-center">
                          {data.sitemap ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <p className="text-sm">XML Sitemap found</p>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                              <p className="text-sm text-amber-600">No XML Sitemap detected</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Social Media</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Open Graph Tags</p>
                        <div className="flex items-center">
                          {data.metaTags?.ogTitle || data.metaTags?.ogDescription || data.metaTags?.ogImage ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <p className="text-sm">Open Graph tags implemented</p>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-500 mr-2" />
                              <p className="text-sm text-red-600">Missing Open Graph tags</p>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 mb-1">Twitter Cards</p>
                        <div className="flex items-center">
                          {data.metaTags?.twitterTitle ||
                          data.metaTags?.twitterDescription ||
                          data.metaTags?.twitterImage ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <p className="text-sm">Twitter Card tags implemented</p>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-500 mr-2" />
                              <p className="text-sm text-red-600">Missing Twitter Card tags</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2 text-blue-600" />
                SEO Recommendations
              </CardTitle>
              <CardDescription>Actionable steps to improve search rankings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.seo_recommendations ? (
                  data.seo_recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Search className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{recommendation.title}</h4>
                        <p className="text-sm text-gray-600">{recommendation.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Search className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Optimize Meta Tags</h4>
                        <p className="text-sm text-gray-600">
                          Ensure all pages have unique, descriptive title tags and meta descriptions.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Search className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Improve Content Structure</h4>
                        <p className="text-sm text-gray-600">
                          Use proper heading hierarchy and include target keywords in headings.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Search className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Add Alt Text to Images</h4>
                        <p className="text-sm text-gray-600">
                          Include descriptive alt text for all images to improve accessibility and SEO.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-purple-600" />
                AI Content Generator
              </CardTitle>
              <CardDescription>Create optimized content based on website analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedAIGenerator websiteData={data} onSignUpClick={handleSignUpClick} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Content Templates
              </CardTitle>
              <CardDescription>Generate specific content types</CardDescription>
            </CardHeader>
            <CardContent>
              <ContentTypeGenerator websiteData={data} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="h-5 w-5 mr-2 text-blue-600" />
                Export Options
              </CardTitle>
              <CardDescription>Download and share your content</CardDescription>
            </CardHeader>
            <CardContent>
              <ContentExport websiteData={data} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="h-4 w-4 mr-1" />
          Analysis completed {new Date().toLocaleDateString()}
        </div>
        <SocialShare url={data.url} title={data.title} />
      </div>

      {/* Sign Up Modal */}
      <SignUpModal isOpen={showSignUpModal} onClose={() => setShowSignUpModal(false)} />

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  )
}
