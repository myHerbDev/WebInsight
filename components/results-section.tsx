"use client"

import { useState } from "react"
import type { WebsiteData } from "@/types/website-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Clipboard,
  Download,
  FileText,
  Globe,
  Loader2,
  Mail,
  MessageSquare,
  Save,
  Share2,
  Star,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SustainabilityChart } from "@/components/sustainability-chart"
import { ContentTypeGenerator } from "@/components/content-type-generator"
import { toast } from "@/components/ui/use-toast"
import {
  shareToTwitter,
  shareToLinkedIn,
  shareToFacebook,
  shareViaGmail,
  createGoogleDoc,
  copyToClipboard,
} from "@/lib/share"

interface ResultsSectionProps {
  data: WebsiteData
  onSignUpClick: (tempUserId?: string) => void
  onSave: () => void
  onFavorite: () => void
  userId: string | null
}

export function ResultsSection({ data, onSignUpClick, onSave, onFavorite, userId }: ResultsSectionProps) {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [toneVoice, setToneVoice] = useState("professional")
  const [isExporting, setIsExporting] = useState<string | null>(null)
  const [markdownEnabled, setMarkdownEnabled] = useState(true)

  const handleExport = async (format: string) => {
    setIsExporting(format)

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysisId: data._id,
          format: format === "pdf" ? "pdf" : markdownEnabled ? "markdown" : "plain",
          includeScreenshot: false,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Export failed")
      }

      const result = await response.json()

      // Handle different export types with real functionality
      switch (format) {
        case "clipboard":
          const success = await copyToClipboard(result.content)
          if (success) {
            toast({
              title: "Copied to clipboard",
              description: "Analysis content has been copied to your clipboard",
            })
          } else {
            throw new Error("Failed to copy to clipboard")
          }
          break

        case "pdf":
          // Create a blob and download as HTML (can be printed as PDF)
          const blob = new Blob([result.content], { type: "text/html" })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `${result.websiteTitle?.replace(/[^a-z0-9]/gi, "_") || "analysis"}_report.html`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          toast({
            title: "PDF Export",
            description: "HTML report downloaded. Open in browser and print as PDF (Ctrl+P).",
          })
          break

        case "gdocs":
          createGoogleDoc(result.content, result.websiteTitle || result.title)
          toast({
            title: "Google Docs",
            description: "Text file downloaded. Upload to Google Docs to edit.",
          })
          break

        case "gmail":
          shareViaGmail({
            title: result.websiteTitle || result.title,
            url: result.websiteUrl || data.url,
            summary: data.summary,
            analysisUrl: window.location.href,
          })
          toast({
            title: "Gmail",
            description: "Gmail compose window opened with analysis content.",
          })
          break

        case "twitter":
          shareToTwitter({
            title: result.websiteTitle || result.title,
            url: result.websiteUrl || data.url,
            summary: data.summary,
            analysisUrl: window.location.href,
          })
          toast({
            title: "Twitter",
            description: "Twitter compose window opened.",
          })
          break

        case "linkedin":
          shareToLinkedIn({
            title: result.websiteTitle || result.title,
            url: result.websiteUrl || data.url,
            summary: data.summary,
            analysisUrl: window.location.href,
          })
          toast({
            title: "LinkedIn",
            description: "LinkedIn share window opened.",
          })
          break

        case "facebook":
          shareToFacebook({
            title: result.websiteTitle || result.title,
            url: result.websiteUrl || data.url,
            summary: data.summary,
            analysisUrl: window.location.href,
          })
          toast({
            title: "Facebook",
            description: "Facebook share window opened.",
          })
          break
      }
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(null)
    }
  }

  return (
    <div className="space-y-8 mb-12">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">{data.title}</h2>
            <p className="text-gray-500 dark:text-gray-400">{data.url}</p>
            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Sustainability: {data.sustainability?.score || 0}%</span>
              <span>Performance: {data.sustainability?.performance || 0}%</span>
              <span>Words: {data.contentStats?.wordCount || 0}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={onFavorite}>
              <Star className="h-4 w-4 mr-2" />
              Favorite
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("clipboard")}
              disabled={isExporting === "clipboard"}
            >
              {isExporting === "clipboard" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4 mr-2" />
              )}
              Share
            </Button>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="generate">Generate</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{data.summary}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs font-medium mr-3">
                          {index + 1}
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {data.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {data.subdomains && data.subdomains.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Related Domains</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.subdomains.map((subdomain, index) => (
                      <div key={index} className="flex items-center p-3 border rounded-lg">
                        <Globe className="h-5 w-5 mr-2 text-gray-500" />
                        <span className="text-sm">{subdomain}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sustainability" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sustainability Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="text-gray-200 dark:text-gray-700"
                          strokeWidth="10"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-purple-500"
                          strokeWidth="10"
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 - (251.2 * (data.sustainability?.score || 0)) / 100}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                      </svg>
                      <div className="absolute text-3xl font-bold">{data.sustainability?.score || 0}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Performance</span>
                        <span>{data.sustainability?.performance || 0}%</span>
                      </div>
                      <Progress value={data.sustainability?.performance || 0} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Script Optimization</span>
                        <span>{data.sustainability?.scriptOptimization || 0}%</span>
                      </div>
                      <Progress value={data.sustainability?.scriptOptimization || 0} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Content Quality</span>
                        <span>{data.sustainability?.duplicateContent || 0}%</span>
                      </div>
                      <Progress value={data.sustainability?.duplicateContent || 0} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Improvement Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {(data.sustainability?.improvements || []).map((improvement, index) => (
                      <li key={index} className="flex items-start p-3 border rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 flex items-center justify-center mr-3 text-xs">
                          {index + 1}
                        </div>
                        <span className="text-sm">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Sustainability Metrics</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <SustainabilityChart data={data.sustainability} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(data.contentStats || {}).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold">{value}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Export & Share Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => handleExport("gdocs")}
                      disabled={!!isExporting}
                    >
                      {isExporting === "gdocs" ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <FileText className="h-4 w-4 mr-2" />
                      )}
                      Google Docs
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => handleExport("gmail")}
                      disabled={!!isExporting}
                    >
                      {isExporting === "gmail" ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Mail className="h-4 w-4 mr-2" />
                      )}
                      Gmail
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => handleExport("twitter")}
                      disabled={!!isExporting}
                    >
                      {isExporting === "twitter" ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <MessageSquare className="h-4 w-4 mr-2" />
                      )}
                      Twitter
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => handleExport("linkedin")}
                      disabled={!!isExporting}
                    >
                      {isExporting === "linkedin" ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <BarChart className="h-4 w-4 mr-2" />
                      )}
                      LinkedIn
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => handleExport("clipboard")}
                      disabled={!!isExporting}
                    >
                      {isExporting === "clipboard" ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Clipboard className="h-4 w-4 mr-2" />
                      )}
                      Copy to Clipboard
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => handleExport("pdf")}
                      disabled={!!isExporting}
                    >
                      {isExporting === "pdf" ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Export PDF
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => handleExport("facebook")}
                      disabled={!!isExporting}
                    >
                      {isExporting === "facebook" ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Share2 className="h-4 w-4 mr-2" />
                      )}
                      Facebook
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Export with Markdown</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={markdownEnabled ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMarkdownEnabled(true)}
                        >
                          Yes
                        </Button>
                        <Button
                          variant={!markdownEnabled ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMarkdownEnabled(false)}
                        >
                          No
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Content Tone</label>
                      <Select value={toneVoice} onValueChange={setToneVoice}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="generate" className="space-y-6">
            <ContentTypeGenerator
              analysisId={data._id}
              tone={toneVoice}
              onSignUpClick={() => onSignUpClick(userId || undefined)}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="bg-purple-50 dark:bg-gray-800/50 rounded-xl p-6 text-center">
        <h3 className="text-xl font-bold mb-3">Save Your Analysis</h3>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Sign up to save your analysis, access historical data, and export to PDF.
        </p>
        <Button
          onClick={() => onSignUpClick(userId || undefined)}
          className="bg-gradient-to-r from-purple-600 to-teal-600"
        >
          Sign Up Now
        </Button>
      </div>
    </div>
  )
}
