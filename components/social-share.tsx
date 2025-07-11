"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Share2, Twitter, Facebook, Linkedin, Copy, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SocialShareProps {
  data?: {
    title?: string
    url?: string
    description?: string
  }
}

export function SocialShare({ data }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  // Early return if no data is provided
  if (!data) {
    return null
  }

  const { title = "Check out this website analysis", url = "", description = "" } = data

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "")
  const shareText = `${title} - ${description}`.trim()

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      })
    }
  }

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  }

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-lg">Share Results</h3>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(shareLinks.twitter, "_blank")}
            className="flex items-center gap-2"
          >
            <Twitter className="h-4 w-4" />
            Twitter
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(shareLinks.facebook, "_blank")}
            className="flex items-center gap-2"
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(shareLinks.linkedin, "_blank")}
            className="flex items-center gap-2"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="flex items-center gap-2 bg-transparent"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
