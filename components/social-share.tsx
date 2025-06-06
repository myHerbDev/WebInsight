"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import {
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  MessageCircle,
  Copy,
  Download,
  FileText,
  Loader2,
} from "lucide-react"
import {
  shareToTwitter,
  shareToLinkedIn,
  shareToFacebook,
  shareViaGmail,
  shareViaWhatsApp,
  shareViaTelegram,
  copyToClipboard,
} from "@/lib/share"
import type { WebsiteData } from "@/types/website-data"

interface SocialShareProps {
  data: WebsiteData
  className?: string
}

export function SocialShare({ data, className = "" }: SocialShareProps) {
  const [isSharing, setIsSharing] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  // Add defensive checks for data
  if (!data) {
    return null
  }

  // Safely extract data with fallbacks
  const title = data.title || data.url || "Website Analysis"
  const url = data.url || ""
  const summary = data.summary || "Website analysis results"
  const analysisId = data._id || ""

  const shareData = {
    title,
    url,
    summary,
    analysisUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/analysis/${analysisId}`,
  }

  const handleShare = async (platform: string) => {
    setIsSharing(platform)
    try {
      switch (platform) {
        case "twitter":
          shareToTwitter(shareData)
          break
        case "linkedin":
          shareToLinkedIn(shareData)
          break
        case "facebook":
          shareToFacebook(shareData)
          break
        case "gmail":
          shareViaGmail(shareData)
          break
        case "whatsapp":
          shareViaWhatsApp(shareData)
          break
        case "telegram":
          shareViaTelegram(shareData)
          break
        case "copy":
          const success = await copyToClipboard(shareData.analysisUrl || shareData.url)
          if (success) {
            toast({
              title: "Link Copied!",
              description: "Analysis link copied to clipboard.",
            })
          } else {
            throw new Error("Failed to copy to clipboard")
          }
          break
        case "native":
          if (navigator.share) {
            await navigator.share({
              title: `Website Analysis: ${shareData.title}`,
              text: `Check out this website analysis: ${shareData.summary.substring(0, 100)}...`,
              url: shareData.analysisUrl || shareData.url,
            })
          } else {
            throw new Error("Native sharing not supported")
          }
          break
      }

      if (platform !== "copy") {
        toast({
          title: "Shared Successfully!",
          description: `Analysis shared via ${platform}.`,
        })
      }
    } catch (error) {
      console.error(`Error sharing via ${platform}:`, error)
      toast({
        title: "Share Failed",
        description: `Failed to share via ${platform}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSharing(null)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysisId: data._id,
          format: "pdf",
          includeScreenshot: false,
        }),
      })

      if (!response.ok) {
        throw new Error("Export failed")
      }

      const result = await response.json()

      // Create and download the file
      const blob = new Blob([result.content], { type: "text/html" })
      const fileUrl = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = fileUrl
      a.download = `${title.replace(/[^a-z0-9]/gi, "_")}_analysis.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(fileUrl)

      toast({
        title: "Export Successful!",
        description: "Analysis report downloaded successfully.",
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export Failed",
        description: "Failed to export analysis. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const shareButtons = [
    {
      platform: "twitter",
      icon: Twitter,
      label: "Twitter",
      color: "hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20",
    },
    {
      platform: "linkedin",
      icon: Linkedin,
      label: "LinkedIn",
      color: "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20",
    },
    {
      platform: "facebook",
      icon: Facebook,
      label: "Facebook",
      color: "hover:bg-blue-50 hover:text-blue-800 dark:hover:bg-blue-900/20",
    },
    {
      platform: "gmail",
      icon: Mail,
      label: "Gmail",
      color: "hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20",
    },
    {
      platform: "whatsapp",
      icon: MessageCircle,
      label: "WhatsApp",
      color: "hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20",
    },
    {
      platform: "copy",
      icon: Copy,
      label: "Copy Link",
      color: "hover:bg-gray-50 hover:text-gray-600 dark:hover:bg-gray-800",
    },
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Share2 className="h-5 w-5" />
          <span>Share Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Analysis Summary */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{url}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white/50 dark:bg-gray-800/50">
              {data.sustainability_score || 0}% Sustainability
            </Badge>
            <Badge variant="outline" className="bg-white/50 dark:bg-gray-800/50">
              {data.performance_score || 0}% Performance
            </Badge>
            <Badge variant="outline" className="bg-white/50 dark:bg-gray-800/50">
              {data.security_score || 0}% Security
            </Badge>
          </div>
        </div>

        {/* Share Buttons */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Share on Social Media</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {shareButtons.map(({ platform, icon: Icon, label, color }) => (
              <Button
                key={platform}
                variant="outline"
                size="sm"
                onClick={() => handleShare(platform)}
                disabled={isSharing === platform}
                className={`justify-start ${color} transition-colors`}
              >
                {isSharing === platform ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Icon className="h-4 w-4 mr-2" />
                )}
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Native Share (Mobile) */}
        {typeof navigator !== "undefined" && navigator.share && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Share</h4>
            <Button
              variant="outline"
              onClick={() => handleShare("native")}
              disabled={isSharing === "native"}
              className="w-full justify-start hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-900/20"
            >
              {isSharing === "native" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4 mr-2" />
              )}
              Share via Device
            </Button>
          </div>
        )}

        {/* Export Options */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Export & Download</h4>
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={isExporting}
              className="w-full justify-start hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/20"
            >
              {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              Download Report
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                const content = `Website Analysis Report\n\nWebsite: ${title}\nURL: ${url}\n\nSustainability Score: ${data.sustainability_score || 0}%\nPerformance Score: ${data.performance_score || 0}%\nSecurity Score: ${data.security_score || 0}%\n\nSummary:\n${summary}\n\nKey Points:\n${(data.key_points || []).map((point, i) => `${i + 1}. ${point}`).join("\n")}\n\nImprovements:\n${(data.improvements || []).map((imp, i) => `${i + 1}. ${imp}`).join("\n")}`

                const blob = new Blob([content], { type: "text/plain" })
                const fileUrl = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = fileUrl
                a.download = `${title.replace(/[^a-z0-9]/gi, "_")}_analysis.txt`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(fileUrl)

                toast({
                  title: "Text Report Downloaded",
                  description: "Analysis report saved as text file.",
                })
              }}
              className="w-full justify-start hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
            >
              <FileText className="h-4 w-4 mr-2" />
              Download as Text
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
