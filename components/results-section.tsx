"use client"

import { useState } from "react"
import type { WebsiteData } from "@/types/website-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Clipboard,
  Download,
  FileText,
  Loader2,
  Mail,
  Save,
  Star,
  ClipboardCopy,
  Linkedin,
  Facebook,
  Twitter,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SustainabilityChart } from "@/components/sustainability-chart"
import { ContentTypeGenerator } from "@/components/content-type-generator"
import { toast } from "@/components/ui/use-toast"
import {
  shareToTwitter,
  shareToLinkedIn, // This is for direct link sharing
  shareToFacebook,
  shareViaGmail,
  createGoogleDoc,
  copyToClipboard,
  generateLinkedInPost, // New import
} from "@/lib/share"
import { cn } from "@/lib/utils"

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
    // ... (existing handleExport logic remains largely the same)
    // Ensure toast messages are styled minimally if needed
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      switch (format) {
        case "clipboard":
          const success = await copyToClipboard(result.content)
          toast({ title: success ? "Copied to clipboard" : "Copy Failed" })
          break
        case "pdf":
          const blob = new Blob([result.content], { type: "text/html" })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `${result.websiteTitle?.replace(/[^a-z0-9]/gi, "_") || "analysis"}_report.html`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          toast({ title: "HTML Report Downloaded", description: "Open in browser and print as PDF." })
          break
        case "gdocs":
          createGoogleDoc(result.content, result.websiteTitle || result.title)
          toast({ title: "Google Docs File Ready", description: "Text file downloaded for Google Docs." })
          break
        // Share functions will open new tabs, toasts confirm action initiation
        case "gmail":
          shareViaGmail({
            title: result.websiteTitle || result.title,
            url: result.websiteUrl || data.url,
            summary: data.summary,
            analysisUrl: window.location.href,
          })
          toast({ title: "Opening Gmail..." })
          break
        case "twitter":
          shareToTwitter({
            title: result.websiteTitle || result.title,
            url: result.websiteUrl || data.url,
            summary: data.summary,
            analysisUrl: window.location.href,
          })
          toast({ title: "Opening Twitter..." })
          break
        case "linkedin": // This is direct link share
          shareToLinkedIn({
            title: result.websiteTitle || result.title,
            url: result.websiteUrl || data.url,
            summary: data.summary,
            analysisUrl: window.location.href,
          })
          toast({ title: "Opening LinkedIn..." })
          break
        case "facebook":
          shareToFacebook({
            title: result.websiteTitle || result.title,
            url: result.websiteUrl || data.url,
            summary: data.summary,
            analysisUrl: window.location.href,
          })
          toast({ title: "Opening Facebook..." })
          break
      }
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(null)
    }
  }

  const handleCopyLinkedInPost = async () => {
    const postText = generateLinkedInPost({
      title: data.title,
      url: data.url,
      summary: data.summary,
      analysisUrl: window.location.href,
    })
    const success = await copyToClipboard(postText)
    if (success) {
      toast({
        title: "LinkedIn Post Copied",
        description: "Suggested post content copied to clipboard.",
      })
    } else {
      toast({
        title: "Copy Failed",
        description: "Could not copy content to clipboard.",
        variant: "destructive",
      })
    }
  }

  const cardClassName = "bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm"
  const tabsListClassName = "grid grid-cols-2 sm:grid-cols-4 mb-6 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg"
  const tabsTriggerClassName =
    "data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm text-slate-600 dark:text-slate-300 data-[state=active]:text-brand-DEFAULT dark:data-[state=active]:text-brand-light py-2 text-sm"

  return (
    <div className="space-y-6 mb-12">
      <Card className={cardClassName}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">{data.title}</h2>
              <p className="text-slate-500 dark:text-slate-400 break-all">{data.url}</p>
              <div className="flex flex-wrap items-center mt-2 space-x-4 text-sm text-slate-600 dark:text-slate-400">
                <span>Sustain: {data.sustainability?.score || 0}%</span>
                <span>Perf: {data.sustainability?.performance || 0}%</span>
                <span>Words: {data.contentStats?.wordCount || 0}</span>
              </div>
            </div>
            <div className="flex space-x-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={onSave}
                className="border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onFavorite}
                className="border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <Star className="h-4 w-4 mr-2" /> Favorite
              </Button>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className={tabsListClassName}>
              <TabsTrigger value="overview" className={tabsTriggerClassName}>
                Overview
              </TabsTrigger>
              <TabsTrigger value="sustainability" className={tabsTriggerClassName}>
                Sustainability
              </TabsTrigger>
              <TabsTrigger value="content" className={tabsTriggerClassName}>
                Content
              </TabsTrigger>
              <TabsTrigger value="generate" className={tabsTriggerClassName}>
                Generate
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card className={cardClassName}>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">{data.summary}</p>
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className={cardClassName}>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Key Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                      {data.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-light text-brand-dark text-xs font-medium mr-2 shrink-0">
                            {index + 1}
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className={cardClassName}>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {data.keywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* ... other overview content ... */}
            </TabsContent>

            {/* Sustainability Tab */}
            <TabsContent value="sustainability" className="space-y-6">
              {/* ... sustainability content with updated cardClassName ... */}
              <Card className={cardClassName}>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Sustainability Metrics</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <SustainabilityChart data={data.sustainability} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <Card className={cardClassName}>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Content Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {Object.entries(data.contentStats || {}).map(([key, value]) => (
                      <div key={key} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{value}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className={cardClassName}>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Export & Share</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Google Docs", icon: FileText, format: "gdocs" },
                        { label: "Gmail", icon: Mail, format: "gmail" },
                        { label: "Twitter", icon: Twitter, format: "twitter" },
                        { label: "LinkedIn Link", icon: Linkedin, format: "linkedin" },
                        {
                          label: "Copy for LinkedIn",
                          icon: ClipboardCopy,
                          format: "copy-linkedin",
                          action: handleCopyLinkedInPost,
                        },
                        { label: "Facebook", icon: Facebook, format: "facebook" },
                        { label: "Copy to Clipboard", icon: Clipboard, format: "clipboard" },
                        { label: "Export HTML (Print to PDF)", icon: Download, format: "pdf" },
                      ].map((item) => {
                        const Icon = item.icon
                        return (
                          <Button
                            key={item.format}
                            variant="outline"
                            className="justify-start border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                            onClick={() => (item.action ? item.action() : handleExport(item.format))}
                            disabled={!!isExporting && isExporting === item.format}
                          >
                            {isExporting === item.format ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Icon className="h-4 w-4 mr-2" />
                            )}
                            {item.label}
                          </Button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
                <Card className={cardClassName}>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Export Settings</CardTitle>
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

            {/* Generate Tab */}
            <TabsContent value="generate" className="space-y-6">
              <ContentTypeGenerator
                analysisId={data._id}
                tone={toneVoice}
                onSignUpClick={() => onSignUpClick(userId || undefined)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className={cn(cardClassName, "p-6 text-center")}>
        <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">Save Your Analysis</h3>
        <p className="mb-4 text-slate-600 dark:text-slate-400">
          Sign up to save your analysis, access historical data, and unlock more features.
        </p>
        <Button
          onClick={() => onSignUpClick(userId || undefined)}
          className="bg-brand-DEFAULT hover:bg-brand-dark text-white"
        >
          Sign Up Now
        </Button>
      </div>
    </div>
  )
}
