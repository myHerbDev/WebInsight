"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SustainabilityChart } from "./sustainability-chart"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ContentTypeGenerator } from "./content-type-generator"
import { Share } from "lucide-react"
import { shareAnalysis } from "@/lib/share"
import { toast } from "@/components/ui/use-toast"
import type { WebsiteData } from "@/types/website-data"

interface ResultsSectionProps {
  data: WebsiteData
  onSignUpClick: (tempUserId: string) => void
  onSave: () => void
  onFavorite: () => void
  userId: string | null
}

export function ResultsSection({ data, onSignUpClick, onSave, onFavorite, userId }: ResultsSectionProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    setIsSharing(true)
    try {
      await shareAnalysis(data)
      toast({
        title: "Link Copied!",
        description: "Analysis link copied to clipboard.",
      })
    } catch (error) {
      console.error("Error sharing analysis:", error)
      toast({
        title: "Share Failed",
        description: "Failed to generate sharing link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
      {/* Header Section with Visual Separation */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{data.title}</h1>
              <p className="text-purple-100 mt-1 text-sm">{data.url}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                {data.sustainability_score}% Sustainability
              </Badge>
              {data.ssl_certificate && (
                <Badge
                  variant="outline"
                  className="bg-green-500/20 text-white border-green-500/30 hover:bg-green-500/30"
                >
                  Secure SSL
                </Badge>
              )}
              {data.hosting_provider_name && (
                <Badge variant="outline" className="bg-blue-500/20 text-white border-blue-500/30 hover:bg-blue-500/30">
                  {data.hosting_provider_name}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300">{data.summary}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={onSave} variant="outline" size="sm">
              Save Analysis
            </Button>
            <Button onClick={onFavorite} variant="outline" size="sm">
              Add to Favorites
            </Button>
            <Button onClick={handleShare} variant="outline" size="sm" disabled={isSharing}>
              <Share className="mr-2 h-4 w-4" />
              {isSharing ? "Sharing..." : "Share"}
            </Button>
            {!userId && (
              <Button
                onClick={() => onSignUpClick("")}
                variant="default"
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Sign Up to Save
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content with Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-white dark:bg-gray-800 rounded-t-xl p-2 shadow-lg">
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="sustainability"
                className="data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900/30"
              >
                Sustainability
              </TabsTrigger>
              <TabsTrigger
                value="content"
                className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30"
              >
                Content
              </TabsTrigger>
              <TabsTrigger
                value="generate"
                className="data-[state=active]:bg-teal-100 dark:data-[state=active]:bg-teal-900/30"
              >
                Generate Content
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-lg overflow-hidden">
            {/* Overview Tab */}
            <TabsContent value="overview" className="p-0 m-0">
              <div className="p-6 space-y-6">
                {/* Key Points Section */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Key Points</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.key_points.map((point, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700"
                      >
                        <p className="text-gray-700 dark:text-gray-300">{point}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />

                {/* Improvements Section */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Suggested Improvements
                  </h2>
                  <div className="space-y-3">
                    {data.improvements.map((improvement, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                      >
                        <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-1 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-blue-600 dark:text-blue-300"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="text-blue-800 dark:text-blue-200">{improvement}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />

                {/* Keywords and Metadata */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Keywords</h2>
                    <div className="flex flex-wrap gap-2">
                      {data.keywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Content Stats</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(data.content_stats).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{key}</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />

                {/* Technical Details */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Technical Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Hosting Provider</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-medium">{data.hosting_provider_name || "Unknown"}</p>
                        {data.server_location && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{data.server_location}</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Security</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${data.security_score > 70 ? "bg-green-500" : data.security_score > 40 ? "bg-yellow-500" : "bg-red-500"}`}
                          ></div>
                          <p className="text-lg font-medium">{data.security_score}% Score</p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {Object.keys(data.security_headers || {}).length} Security Headers
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">IP Address</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-medium font-mono">{data.ip_address || "Unknown"}</p>
                        {data.subdomains && data.subdomains.length > 0 && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {data.subdomains.length} Subdomains
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </section>
              </div>
            </TabsContent>

            {/* Sustainability Tab */}
            <TabsContent value="sustainability" className="p-0 m-0">
              <div className="p-6 space-y-6">
                <section>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Sustainability Score</h2>
                    <Badge
                      variant="outline"
                      className={`text-lg px-3 py-1 ${
                        data.sustainability_score > 70
                          ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                          : data.sustainability_score > 40
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800"
                            : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                      }`}
                    >
                      {data.sustainability_score}%
                    </Badge>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <SustainabilityChart
                      performance={data.performance_score}
                      scriptOptimization={data.script_optimization_score}
                      contentQuality={data.content_quality_score}
                      security={data.security_score}
                    />
                  </div>
                </section>

                <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Performance Metrics</h2>
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700 dark:text-gray-300">Performance Score</span>
                          <span
                            className={`font-semibold ${
                              data.performance_score > 70
                                ? "text-green-600 dark:text-green-400"
                                : data.performance_score > 40
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {data.performance_score}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              data.performance_score > 70
                                ? "bg-green-500"
                                : data.performance_score > 40
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${data.performance_score}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700 dark:text-gray-300">Script Optimization</span>
                          <span
                            className={`font-semibold ${
                              data.script_optimization_score > 70
                                ? "text-green-600 dark:text-green-400"
                                : data.script_optimization_score > 40
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {data.script_optimization_score}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              data.script_optimization_score > 70
                                ? "bg-green-500"
                                : data.script_optimization_score > 40
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${data.script_optimization_score}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700 dark:text-gray-300">Content Quality</span>
                          <span
                            className={`font-semibold ${
                              data.content_quality_score > 70
                                ? "text-green-600 dark:text-green-400"
                                : data.content_quality_score > 40
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {data.content_quality_score}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              data.content_quality_score > 70
                                ? "bg-green-500"
                                : data.content_quality_score > 40
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${data.content_quality_score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Sustainability Improvements
                    </h2>
                    <div className="space-y-3">
                      {data.improvements
                        .filter(
                          (imp) =>
                            imp.toLowerCase().includes("sustain") ||
                            imp.toLowerCase().includes("green") ||
                            imp.toLowerCase().includes("carbon") ||
                            imp.toLowerCase().includes("energy") ||
                            imp.toLowerCase().includes("cache") ||
                            imp.toLowerCase().includes("optimize"),
                        )
                        .map((improvement, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                          >
                            <div className="bg-green-100 dark:bg-green-800 rounded-full p-1 mt-0.5">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-green-600 dark:text-green-300"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <p className="text-green-800 dark:text-green-200">{improvement}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </section>

                <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Environmental Impact</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Hosting Provider</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-medium">{data.hosting_provider_name || "Unknown"}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {data.hosting_provider_name && data.hosting_provider_name.toLowerCase().includes("green")
                            ? "Green Hosting Provider"
                            : "Standard Hosting Provider"}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Page Weight</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-medium">
                          {data.content_stats && data.content_stats.images > 20
                            ? "Heavy"
                            : data.content_stats && data.content_stats.images > 10
                              ? "Medium"
                              : "Light"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Based on {data.content_stats?.images || 0} images and resource count
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Optimization Level</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-medium">
                          {data.performance_score > 70
                            ? "Well Optimized"
                            : data.performance_score > 40
                              ? "Needs Improvement"
                              : "Poor Optimization"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Based on performance metrics</p>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="p-0 m-0">
              <div className="p-6 space-y-6">
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Content Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Word Count</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold">{data.content_stats?.wordCount || 0}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Paragraphs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold">{data.content_stats?.paragraphs || 0}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Headings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold">{data.content_stats?.headings || 0}</p>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Keywords</h2>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                      <div className="flex flex-wrap gap-2">
                        {data.keywords.map((keyword, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Content Quality</h2>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 dark:text-gray-300">Content Quality Score</span>
                        <span
                          className={`font-semibold ${
                            data.content_quality_score > 70
                              ? "text-green-600 dark:text-green-400"
                              : data.content_quality_score > 40
                                ? "text-yellow-600 dark:text-yellow-400"
                                : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {data.content_quality_score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            data.content_quality_score > 70
                              ? "bg-green-500"
                              : data.content_quality_score > 40
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${data.content_quality_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Content Samples</h2>

                  {/* Headings */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Headings</h3>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700 max-h-60 overflow-y-auto">
                      {data.raw_data?.headings && data.raw_data.headings.length > 0 ? (
                        <ul className="space-y-2">
                          {data.raw_data.headings.map((heading, index) => (
                            <li key={index} className="text-gray-700 dark:text-gray-300">
                              {heading}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">No headings found</p>
                      )}
                    </div>
                  </div>

                  {/* Paragraphs */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Paragraphs</h3>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700 max-h-80 overflow-y-auto">
                      {data.raw_data?.paragraphs && data.raw_data.paragraphs.length > 0 ? (
                        <div className="space-y-4">
                          {data.raw_data.paragraphs.map((paragraph, index) => (
                            <p key={index} className="text-gray-700 dark:text-gray-300">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">No paragraphs found</p>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </TabsContent>

            {/* Generate Content Tab */}
            <TabsContent value="generate" className="p-0 m-0">
              <div className="p-6">
                <ContentTypeGenerator websiteData={data} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
