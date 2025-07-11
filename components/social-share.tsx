"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2, Twitter, Facebook, Linkedin, Link, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface SocialShareProps {
  data?: {
    title?: string
    url?: string
    description?: string
  }
  className?: string
}

export function SocialShare({ data, className = "" }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  // Early return if no data is provided
  if (!data?.title || !data?.url) {
    return null
  }

  const shareUrl = encodeURIComponent(data.url)
  const shareTitle = encodeURIComponent(data.title)
  const shareDescription = encodeURIComponent(data.description || "")

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(data.url)
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
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
            onClick={copyToClipboard}
            className="flex items-center gap-2 bg-transparent"
          >
            {copied ? <Check className="h-4 w-4" /> : <Link className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
