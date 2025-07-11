"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Share2, Twitter, Linkedin, Facebook, Copy } from "lucide-react"
import type { WebsiteData } from "@/types/website-data"
import { toast } from "@/components/ui/use-toast"

interface SocialShareProps {
  data?: WebsiteData | null
}

export function SocialShare({ data }: SocialShareProps) {
  // If no data yet, don’t render the share menu
  if (!data) return null

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""
  const title = `Check out the WSfynder analysis for ${data?.title ?? data?.url ?? "your website"}!`
  const summary = data?.summary ?? "Get sustainability and performance insights for your website with WSfynder."

  const shareOptions = [
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
  ]

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({ title: "Link Copied!", description: "Analysis link copied to clipboard." })
    } catch (err) {
      toast({ title: "Copy Failed", description: "Could not copy link.", variant: "destructive" })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share Results
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {shareOptions.map((option) => {
          const Icon = option.icon
          return (
            <DropdownMenuItem
              key={option.name}
              onClick={() => window.open(option.url, "_blank")}
              className="flex items-center space-x-2"
            >
              <Icon className="h-4 w-4" />
              <span>Share on {option.name}</span>
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuItem onClick={copyLink} className="flex items-center space-x-2">
          <Copy className="h-4 w-4" />
          <span>Copy Link</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
