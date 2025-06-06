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
  BarChartHorizontalBig,
  Leaf,
  FileSignature,
  Sparkles,
  ExternalLink,
  Info,
  CheckCircle,
  Globe,
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
  generateLinkedInPost,
} from "@/lib/share"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId: data._id,
          format: format === "pdf" ? "pdf" : markdownEnabled ? "markdown" : "plain",
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
        case "pdf": // This downloads HTML to be printed as PDF
          const blob = new Blob([result.content], { type: "text/html" })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `${result.websiteTitle?.replace(/[^a-z0-9]/gi, "_") || "analysis"}_report.html`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          toast({ title: "HTML Report Downloaded", description: "Open in browser and print to PDF." })
          break
        case "gdocs":
          createGoogleDoc(result.content, result.websiteTitle || result.title)
          toast({ title: "Google Docs File Ready", description: "Text file downloaded for Google Docs." })
          break
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
        case "linkedin":
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
    toast({
      title: success ? "LinkedIn Post Copied" : "Copy Failed",
      description: success ? "Suggested post content copied." : "Could not copy content.",
      variant: success ? "default" : "destructive",
    })
  }

  const cardClassName =
    "bg-card rounded-xl border border-border/70 shadow-lg overflow-hidden glass-morphism card-hover-lift"
  const tabsListClassName = "grid grid-cols-2 sm:grid-cols-4 mb-6 bg-secondary/70 p-1 rounded-lg backdrop-blur-sm"
  const tabsTriggerClassName =
    "data-[state=active]:bg-card data-[state=active]:shadow-md text-muted-foreground data-[state=active]:text-primary-gradient-start py-2.5 text-sm font-medium flex items-center justify-center gap-2 rounded-md transition-all hover:bg-secondary/50"

  const tabIcons = {
    overview: BarChartHorizontalBig,
    sustainability: Leaf,
    content: FileSignature,
    generate: Sparkles,
  }

  return (
    <div className="space-y-8 mb-12 animate-slide-up-fade-in">
      <Card className={cn(cardClassName, "mt-0")}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl font-semibold text-foreground">{data.title}</h2>
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-text hover:underline flex items-center gap-1 break-all"
              >
                {data.url} <ExternalLink className="h-3 w-3" />
              </a>
              <div className="flex flex-wrap items-center mt-2 space-x-4 text-xs text-muted-foreground">
                <span>
                  Sustain: <strong className="text-foreground">{data.sustainability?.score || 0}%</strong>
                </span>
                <span>
                  Perf: <strong className="text-foreground">{data.sustainability?.performance || 0}%</strong>
                </span>
                <span>
                  Words: <strong className="text-foreground">{data.contentStats?.wordCount || 0}</strong>
                </span>
              </div>
            </div>
            <div className="flex space-x-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={onSave}
                className="border-input hover:bg-secondary google-button"
              >
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onFavorite}
                className="border-input hover:bg-secondary google-button"
              >
                <Star className="h-4 w-4 mr-2" /> Favorite
              </Button>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className={tabsListClassName}>
              {Object.entries(tabIcons).map(([tabKey, Icon]) => (
                <TabsTrigger key={tabKey} value={tabKey} className={tabsTriggerClassName}>
                  <Icon className="h-4 w-4" />
                  {tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className={cardClassName}>
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Info className="h-5 w-5 text-brand-DEFAULT" /> Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{data.summary}</p>
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-xl shadow-md border-border/60 bg-secondary/30 dark:bg-secondary/20 backdrop-blur-sm glass-morphism">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Key Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground">
                      {data.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="rounded-xl shadow-md border-border/60 bg-secondary/30 dark:bg-secondary/20 backdrop-blur-sm glass-morphism">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {data.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="bg-secondary text-foreground">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              {data.subdomains && data.subdomains.length > 0 && (
                <Card className="rounded-xl shadow-md border-border/60 bg-secondary/30 dark:bg-secondary/20 backdrop-blur-sm glass-morphism">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Globe className="h-5 w-5 text-brand-DEFAULT" /> Related Domains
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {data.subdomains.map((subdomain, index) => (
                        <div
                          key={index}
                          className="flex items-center p-2.5 border border-border rounded-md bg-secondary text-sm"
                        >
                          <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-foreground truncate">{subdomain}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="sustainability" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-xl shadow-md border-border/60 bg-secondary/30 dark:bg-secondary/20 backdrop-blur-sm glass-morphism">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Sustainability Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center mb-6">
                      <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            className="text-secondary dark:text-slate-700"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className="text-brand-DEFAULT"
                            strokeWidth="10"
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 - (251.2 * (data.sustainability?.score || 0)) / 100}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                            style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
                          />
                        </svg>
                        <div className="absolute text-3xl font-semibold text-foreground">
                          {data.sustainability?.score || 0}
                          <span className="text-lg">%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: "Performance", value: data.sustainability?.performance || 0 },
                        { label: "Script Optimization", value: data.sustainability?.scriptOptimization || 0 },
                        { label: "Content Quality", value: data.sustainability?.duplicateContent || 0 },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-medium text-foreground">{item.value}%</span>
                          </div>
                          <Progress value={item.value} className="h-2 bg-secondary" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-xl shadow-md border-border/60 bg-secondary/30 dark:bg-secondary/20 backdrop-blur-sm glass-morphism">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Improvement Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {(data.sustainability?.improvements || []).map((improvement, index) => (
                        <li key={index} className="flex items-start p-3 border border-border rounded-md bg-secondary">
                          <div className="w-5 h-5 rounded-full bg-brand-light text-brand-dark flex items-center justify-center mr-3 text-xs font-medium shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-sm text-foreground">{improvement}</span>
                        </li>
                      ))}
                      {(data.sustainability?.improvements || []).length === 0 && (
                        <p className="text-sm text-muted-foreground">No specific sustainability improvements found.</p>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <Card className="rounded-xl shadow-md border-border/60 bg-card dark:bg-card backdrop-blur-sm glass-morphism">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Sustainability Metrics Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <SustainabilityChart data={data.sustainability} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card className="rounded-xl shadow-md border-border/60 bg-secondary/30 dark:bg-secondary/20 backdrop-blur-sm glass-morphism">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Content Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {Object.entries(data.contentStats || {}).map(([key, value]) => (
                      <div key={key} className="bg-secondary p-4 rounded-lg text-center">
                        <div className="text-2xl font-semibold text-foreground">{value}</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-xl shadow-md border-border/60 bg-secondary/30 dark:bg-secondary/20 backdrop-blur-sm glass-morphism">
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
                        { label: "Copy Text", icon: Clipboard, format: "clipboard" },
                        { label: "Export HTML", icon: Download, format: "pdf" },
                      ].map((item) => {
                        const Icon = item.icon
                        return (
                          <Button
                            key={item.format}
                            variant="outline"
                            className="justify-start border-input hover:bg-secondary text-sm google-button"
                            onClick={() => (item.action ? item.action() : handleExport(item.format))}
                            disabled={!!isExporting && isExporting === item.format}
                          >
                            {isExporting === item.format ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Icon className="h-4 w-4 mr-2 text-muted-foreground" />
                            )}
                            {item.label}
                          </Button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-xl shadow-md border-border/60 bg-secondary/30 dark:bg-secondary/20 backdrop-blur-sm glass-morphism">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Export Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Export with Markdown</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={markdownEnabled ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMarkdownEnabled(true)}
                          className={
                            markdownEnabled ? "bg-brand-DEFAULT text-primary-foreground" : "border-input google-button"
                          }
                        >
                          Yes
                        </Button>
                        <Button
                          variant={!markdownEnabled ? "default" : "outline"}
                          size="sm"
                          onClick={() => setMarkdownEnabled(false)}
                          className={
                            !markdownEnabled ? "bg-brand-DEFAULT text-primary-foreground" : "border-input google-button"
                          }
                        >
                          No
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Content Tone</label>
                      <Select value={toneVoice} onValueChange={setToneVoice}>
                        <SelectTrigger className="border-input">
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
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="generate" className="space-y-6">
              <Card className="rounded-xl shadow-md border-border/60 bg-card dark:bg-card backdrop-blur-sm glass-morphism">
                <ContentTypeGenerator
                  analysisId={data._id}
                  tone={toneVoice}
                  onSignUpClick={() => onSignUpClick(userId || undefined)}
                />
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card
        className={cn(
          cardClassName,
          "p-6 sm:p-8 text-center bg-gradient-to-br from-primary-gradient-start/10 via-primary-gradient-middle/5 to-primary-gradient-end/10 dark:from-primary-gradient-start/5 dark:via-primary-gradient-middle/0 dark:to-primary-gradient-end/5",
        )}
      >
        <CardHeader className="p-0 mb-3">
          <CardTitle className="text-xl font-semibold text-brand-dark dark:text-brand-light">
            Unlock Full Potential
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="mb-4 text-brand-text dark:text-slate-300 text-sm">
            Sign up to save your analysis, access historical data, and export to PDF.
          </p>
          <Button
            onClick={() => onSignUpClick(userId || undefined)}
            className="bg-primary-gradient hover:opacity-90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03] google-button"
            style={{ backgroundSize: "200% auto" }}
          >
            Sign Up Now
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Export both named and default exports for compatibility
export default ResultsSection
