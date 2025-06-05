"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { X, BarChart3, TrendingUp, TrendingDown, Minus, Download } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ComparisonData {
  id: string
  title: string
  url: string
  sustainability_score: number
  performance_score: number
  security_score: number
  content_quality_score: number
  hosting_provider_name: string
  ssl_certificate: boolean
  created_at: string
}

export default function ComparePage() {
  const [websites, setWebsites] = useState<ComparisonData[]>([])
  const [newUrl, setNewUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [comparisonName, setComparisonName] = useState("")

  const analyzeWebsite = async (url: string) => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) throw new Error("Analysis failed")

      const data = await response.json()

      const comparisonData: ComparisonData = {
        id: data._id,
        title: data.title,
        url: data.url,
        sustainability_score: data.sustainability_score || 0,
        performance_score: data.performance_score || 0,
        security_score: data.security_score || 0,
        content_quality_score: data.content_quality_score || 0,
        hosting_provider_name: data.hosting_provider_name || "Unknown",
        ssl_certificate: data.ssl_certificate || false,
        created_at: new Date().toISOString(),
      }

      setWebsites((prev) => [...prev, comparisonData])
      setNewUrl("")

      toast({
        title: "Analysis Complete",
        description: `${data.title} has been added to comparison`,
      })
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze website. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const removeWebsite = (id: string) => {
    setWebsites((prev) => prev.filter((w) => w.id !== id))
  }

  const getAverageScores = () => {
    if (websites.length === 0) return { sustainability: 0, performance: 0, security: 0, content: 0 }

    return {
      sustainability: Math.round(websites.reduce((sum, w) => sum + w.sustainability_score, 0) / websites.length),
      performance: Math.round(websites.reduce((sum, w) => sum + w.performance_score, 0) / websites.length),
      security: Math.round(websites.reduce((sum, w) => sum + w.security_score, 0) / websites.length),
      content: Math.round(websites.reduce((sum, w) => sum + w.content_quality_score, 0) / websites.length),
    }
  }

  const getBestPerformer = (metric: keyof ComparisonData) => {
    if (websites.length === 0) return null
    return websites.reduce((best, current) => ((current[metric] as number) > (best[metric] as number) ? current : best))
  }

  const getScoreComparison = (score: number, average: number) => {
    const diff = score - average
    if (Math.abs(diff) < 5) return { icon: Minus, color: "text-gray-500", text: "Average" }
    if (diff > 0) return { icon: TrendingUp, color: "text-green-500", text: `+${diff}` }
    return { icon: TrendingDown, color: "text-red-500", text: `${diff}` }
  }

  const saveComparison = async () => {
    if (websites.length < 2) {
      toast({
        title: "Insufficient Data",
        description: "Add at least 2 websites to save comparison",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/comparisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: comparisonName || `Comparison ${new Date().toLocaleDateString()}`,
          analysis_ids: websites.map((w) => w.id),
          comparison_data: {
            websites,
            averages: getAverageScores(),
            created_at: new Date().toISOString(),
          },
        }),
      })

      if (response.ok) {
        toast({
          title: "Comparison Saved",
          description: "Your comparison has been saved successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save comparison",
        variant: "destructive",
      })
    }
  }

  const exportComparison = () => {
    const csvContent = [
      ["Website", "URL", "Sustainability", "Performance", "Security", "Content Quality", "Hosting Provider", "SSL"],
      ...websites.map((w) => [
        w.title,
        w.url,
        w.sustainability_score,
        w.performance_score,
        w.security_score,
        w.content_quality_score,
        w.hosting_provider_name,
        w.ssl_certificate ? "Yes" : "No",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `website-comparison-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const averages = getAverageScores()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Website Comparison Tool</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Compare multiple websites side-by-side to identify performance differences, security gaps, and sustainability
          opportunities.
        </p>

        {/* Add Website Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Website to Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter website URL (e.g., example.com)"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && newUrl && analyzeWebsite(newUrl)}
                className="flex-1"
              />
              <Button onClick={() => newUrl && analyzeWebsite(newUrl)} disabled={isAnalyzing || !newUrl}>
                {isAnalyzing ? "Analyzing..." : "Add Website"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Actions */}
        {websites.length > 0 && (
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Comparison name (optional)"
              value={comparisonName}
              onChange={(e) => setComparisonName(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={saveComparison} variant="outline">
              Save Comparison
            </Button>
            <Button onClick={exportComparison} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        )}
      </div>

      {websites.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No Websites Added</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Add websites above to start comparing their performance, security, and sustainability metrics.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Average Scores Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Average Scores Across {websites.length} Websites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{averages.sustainability}%</div>
                  <div className="text-sm text-gray-500">Sustainability</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{averages.performance}%</div>
                  <div className="text-sm text-gray-500">Performance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{averages.security}%</div>
                  <div className="text-sm text-gray-500">Security</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{averages.content}%</div>
                  <div className="text-sm text-gray-500">Content Quality</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Website</th>
                      <th className="text-center p-4">Sustainability</th>
                      <th className="text-center p-4">Performance</th>
                      <th className="text-center p-4">Security</th>
                      <th className="text-center p-4">Content</th>
                      <th className="text-center p-4">Hosting</th>
                      <th className="text-center p-4">SSL</th>
                      <th className="text-center p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {websites.map((website) => {
                      const sustainabilityComp = getScoreComparison(
                        website.sustainability_score,
                        averages.sustainability,
                      )
                      const performanceComp = getScoreComparison(website.performance_score, averages.performance)
                      const securityComp = getScoreComparison(website.security_score, averages.security)
                      const contentComp = getScoreComparison(website.content_quality_score, averages.content)

                      return (
                        <tr key={website.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{website.title}</div>
                              <div className="text-sm text-gray-500">{website.url}</div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-bold">{website.sustainability_score}%</span>
                              <sustainabilityComp.icon className={`h-4 w-4 ${sustainabilityComp.color}`} />
                            </div>
                            <Progress value={website.sustainability_score} className="w-16 h-2 mx-auto mt-1" />
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-bold">{website.performance_score}%</span>
                              <performanceComp.icon className={`h-4 w-4 ${performanceComp.color}`} />
                            </div>
                            <Progress value={website.performance_score} className="w-16 h-2 mx-auto mt-1" />
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-bold">{website.security_score}%</span>
                              <securityComp.icon className={`h-4 w-4 ${securityComp.color}`} />
                            </div>
                            <Progress value={website.security_score} className="w-16 h-2 mx-auto mt-1" />
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-bold">{website.content_quality_score}%</span>
                              <contentComp.icon className={`h-4 w-4 ${contentComp.color}`} />
                            </div>
                            <Progress value={website.content_quality_score} className="w-16 h-2 mx-auto mt-1" />
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="outline" className="text-xs">
                              {website.hosting_provider_name}
                            </Badge>
                          </td>
                          <td className="p-4 text-center">
                            <Badge
                              className={
                                website.ssl_certificate
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }
                            >
                              {website.ssl_certificate ? "Yes" : "No"}
                            </Badge>
                          </td>
                          <td className="p-4 text-center">
                            <Button variant="ghost" size="sm" onClick={() => removeWebsite(website.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Best Performers</h4>
                  <ul className="space-y-1 text-sm">
                    <li>🌱 Sustainability: {getBestPerformer("sustainability_score")?.title}</li>
                    <li>⚡ Performance: {getBestPerformer("performance_score")?.title}</li>
                    <li>🔒 Security: {getBestPerformer("security_score")?.title}</li>
                    <li>📝 Content: {getBestPerformer("content_quality_score")?.title}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Focus on improving lowest-scoring metrics</li>
                    <li>• Consider green hosting providers for sustainability</li>
                    <li>• Implement security best practices across all sites</li>
                    <li>• Optimize performance for better user experience</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
