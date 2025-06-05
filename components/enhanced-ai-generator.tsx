"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import {
  Brain,
  Copy,
  Mail,
  Download,
  Sparkles,
  FileText,
  MessageSquare,
  Megaphone,
  Clock,
  Check,
  Loader2,
  Heart,
  ExternalLink,
} from "lucide-react"
import type { WebsiteData } from "@/types/website-data"

interface AIContent {
  id: string
  type: string
  title: string
  content: string
  markdown: string
  createdAt: string
  websiteUrl?: string
  isFavorite?: boolean
}

interface EnhancedAIGeneratorProps {
  websiteData?: WebsiteData | null
  onSignUpClick: () => void
}

const contentTypes = [
  { value: "blog-post", label: "Blog Post", icon: FileText, description: "Comprehensive blog article" },
  { value: "social-media", label: "Social Media", icon: MessageSquare, description: "Engaging social posts" },
  { value: "newsletter", label: "Newsletter", icon: Mail, description: "Email newsletter content" },
  { value: "press-release", label: "Press Release", icon: Megaphone, description: "Professional announcement" },
  {
    value: "product-description",
    label: "Product Description",
    icon: Sparkles,
    description: "Compelling product copy",
  },
  { value: "meta-description", label: "SEO Meta", icon: Brain, description: "SEO-optimized descriptions" },
]

export function EnhancedAIGenerator({ websiteData, onSignUpClick }: EnhancedAIGeneratorProps) {
  const [selectedType, setSelectedType] = useState("blog-post")
  const [customPrompt, setCustomPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<AIContent | null>(null)
  const [contentHistory, setContentHistory] = useState<AIContent[]>([])
  const [activeTab, setActiveTab] = useState("generate")
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})

  // Load content history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("ai-content-history")
    if (savedHistory) {
      try {
        setContentHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error("Error loading content history:", error)
      }
    }
  }, [])

  // Save content to history
  const saveToHistory = (content: AIContent) => {
    const updatedHistory = [content, ...contentHistory.slice(0, 19)] // Keep last 20 items
    setContentHistory(updatedHistory)
    localStorage.setItem("ai-content-history", JSON.stringify(updatedHistory))
  }

  const generateContent = async () => {
    if (!websiteData && !customPrompt.trim()) {
      toast({
        title: "Input Required",
        description: "Please analyze a website first or provide a custom prompt.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          websiteData,
          contentType: selectedType,
          customPrompt: customPrompt.trim(),
          includeAnalytics: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate content")
      }

      const newContent: AIContent = {
        id: Date.now().toString(),
        type: selectedType,
        title:
          data.title ||
          `${contentTypes.find((t) => t.value === selectedType)?.label} - ${new Date().toLocaleDateString()}`,
        content: data.content,
        markdown: data.markdown || data.content,
        createdAt: new Date().toISOString(),
        websiteUrl: websiteData?.url,
        isFavorite: false,
      }

      setGeneratedContent(newContent)
      saveToHistory(newContent)
      setActiveTab("result")

      toast({
        title: "Content Generated!",
        description: "Your AI-powered content is ready to use.",
      })
    } catch (error: any) {
      console.error("Error generating content:", error)
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string, format: "markdown" | "plain", contentId?: string) => {
    try {
      await navigator.clipboard.writeText(text)

      const key = `${contentId || "current"}-${format}`
      setCopiedStates((prev) => ({ ...prev, [key]: true }))

      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }))
      }, 2000)

      toast({
        title: "Copied!",
        description: `Content copied to clipboard as ${format}.`,
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive",
      })
    }
  }

  const shareViaEmail = (content: AIContent) => {
    const subject = encodeURIComponent(`AI Generated Content: ${content.title}`)
    const body = encodeURIComponent(`
Hi there!

I've generated some amazing content using AI analysis. Here it is:

Title: ${content.title}
Generated: ${new Date(content.createdAt).toLocaleDateString()}
${content.websiteUrl ? `Website: ${content.websiteUrl}` : ""}

Content:
${content.content}

---
Generated with Website Sustainability Analytics
    `)

    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const downloadContent = (content: AIContent, format: "txt" | "md") => {
    const text = format === "md" ? content.markdown : content.content
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${content.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const toggleFavorite = (contentId: string) => {
    const updatedHistory = contentHistory.map((item) =>
      item.id === contentId ? { ...item, isFavorite: !item.isFavorite } : item,
    )
    setContentHistory(updatedHistory)
    localStorage.setItem("ai-content-history", JSON.stringify(updatedHistory))

    if (generatedContent?.id === contentId) {
      setGeneratedContent((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null))
    }
  }

  const ContentCard = ({ content, isActive = false }: { content: AIContent; isActive?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border p-6 space-y-4 ${isActive ? "border-blue-200 bg-blue-50/30" : "border-gray-200 hover:border-gray-300"} transition-all duration-200`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {contentTypes.find((t) => t.value === content.type)?.label || content.type}
            </Badge>
            <span className="text-xs text-gray-500">{new Date(content.createdAt).toLocaleDateString()}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">{content.title}</h3>
          {content.websiteUrl && (
            <p className="text-sm text-gray-600 mb-2">
              <ExternalLink className="w-3 h-3 inline mr-1" />
              {content.websiteUrl}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleFavorite(content.id)}
          className="text-gray-400 hover:text-red-500"
        >
          <Heart className={`w-4 h-4 ${content.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </Button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
        <p className="text-sm text-gray-700 line-clamp-4">{content.content.substring(0, 200)}...</p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(content.content, "plain", content.id)}
            className="text-xs"
          >
            {copiedStates[`${content.id}-plain`] ? (
              <Check className="w-3 h-3 mr-1" />
            ) : (
              <Copy className="w-3 h-3 mr-1" />
            )}
            Copy Text
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(content.markdown, "markdown", content.id)}
            className="text-xs"
          >
            {copiedStates[`${content.id}-markdown`] ? (
              <Check className="w-3 h-3 mr-1" />
            ) : (
              <Copy className="w-3 h-3 mr-1" />
            )}
            Copy MD
          </Button>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={() => shareViaEmail(content)} className="text-xs">
            <Mail className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => downloadContent(content, "txt")} className="text-xs">
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-xl p-1">
          <TabsTrigger value="generate" className="rounded-lg">
            <Brain className="w-4 h-4 mr-2" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="result" disabled={!generatedContent} className="rounded-lg">
            <FileText className="w-4 h-4 mr-2" />
            Result
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg">
            <Clock className="w-4 h-4 mr-2" />
            History ({contentHistory.length})
          </TabsTrigger>
        </TabsList>

        {/* Generate Tab */}
        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentTypes.map((type) => {
              const Icon = type.icon
              return (
                <motion.div key={type.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedType === type.value
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => setSelectedType(type.value)}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon
                        className={`w-8 h-8 mx-auto mb-2 ${
                          selectedType === type.value ? "text-blue-600" : "text-gray-600"
                        }`}
                      />
                      <h3 className="font-semibold text-sm mb-1">{type.label}</h3>
                      <p className="text-xs text-gray-500">{type.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Instructions (Optional)</label>
              <Textarea
                placeholder="Add specific requirements, tone, target audience, or any other instructions..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {websiteData ? (
                  <span className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-1" />
                    Website data available: {websiteData.url}
                  </span>
                ) : (
                  <span className="text-amber-600">No website data - will use custom prompt only</span>
                )}
              </div>

              <Button
                onClick={generateContent}
                disabled={isGenerating || (!websiteData && !customPrompt.trim())}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Result Tab */}
        <TabsContent value="result" className="space-y-6">
          {generatedContent && <ContentCard content={generatedContent} isActive />}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          {contentHistory.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content Yet</h3>
              <p className="text-gray-600 mb-4">Generate your first AI content to see it here.</p>
              <Button onClick={() => setActiveTab("generate")} variant="outline">
                Start Generating
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Content History</h3>
                <Badge variant="secondary">{contentHistory.length} items</Badge>
              </div>

              <div className="grid gap-4">
                {contentHistory.map((content) => (
                  <ContentCard key={content.id} content={content} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
