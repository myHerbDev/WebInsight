"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Twitter, Facebook, Linkedin, Copy, Check } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { WebsiteData } from "@/types/website-data"

interface SocialShareProps {
  url: string
  title: string
  description: string
  data?: WebsiteData
}

export function SocialShare({ url, title, description, data }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  // Early return if data is not available
  if (!data) {
    return null
  }

  const shareText = `${title} - ${description}`
  const encodedUrl = encodeURIComponent(url)
  const encodedText = encodeURIComponent(shareText)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Share2 className="h-4 w-4" />
          Share Analysis
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => window.open(shareLinks.twitter, "_blank")}>
          <Twitter className="h-4 w-4 mr-2" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(shareLinks.facebook, "_blank")}>
          <Facebook className="h-4 w-4 mr-2" />
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(shareLinks.linkedin, "_blank")}>
          <Linkedin className="h-4 w-4 mr-2" />
          Share on LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard}>
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          {copied ? "Copied!" : "Copy Link"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
