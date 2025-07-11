"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Copy, Twitter, Facebook, Linkedin, Check } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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

  const { title = "Website Analysis", url = "", description = "Check out this website analysis" } = data

  const shareUrl = typeof window !== "undefined" ? window.location.href : url
  const shareText = `${title} - ${description}`

  const copyToClipboard = async () => {
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

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, "_blank", "noopener,noreferrer")
  }

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, "_blank", "noopener,noreferrer")
  }

  const shareOnLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    window.open(linkedinUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Share this analysis</h4>
            <p className="text-xs text-muted-foreground mb-3">{description}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={shareOnTwitter} className="flex-1 gap-2 bg-transparent">
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            <Button variant="outline" size="sm" onClick={shareOnFacebook} className="flex-1 gap-2 bg-transparent">
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>
            <Button variant="outline" size="sm" onClick={shareOnLinkedIn} className="flex-1 gap-2 bg-transparent">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted"
            />
            <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2 bg-transparent">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
