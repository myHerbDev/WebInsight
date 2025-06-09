// This file was already provided in the user's context and seems mostly fine.
// I will use the existing one and ensure it integrates.
// Key changes:
// - Ensure `WebsiteData` type is correctly imported and used.
// - Use `safeFetch` for API calls.
// - Ensure all icons are imported from lucide-react.
// - Check for client-side rendering needs (`useEffect` for `isClient`).
"use client"

import { useState, useEffect, useMemo } from "react"
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
  TreePine,
  MapPin,
  Target,
  Zap,
  Leaf,
  Globe,
  TrendingUp,
  BookOpen,
  Settings2,
  Palette,
  Users2,
} from "lucide-react"
import type { WebsiteData } from "@/types/website-data"
import { safeFetch } from "@/lib/safe-fetch"

interface AIContent {
  id: string
  type: string
  title: string
  content: string
  markdown: string
  createdAt: string
  websiteUrl?: string
  isFavorite?: boolean
  wordCount?: number
  readingTime?: number
}

interface EnhancedAIGeneratorProps {
  websiteData?: WebsiteData | null
  onSignUpClick: () => void
}

const contentCategories = [
  { value: "research", label: "Research", icon: TreePine },
  { value: "strategy", label: "Strategy", icon: Target },
  { value: "technical", label: "Technical", icon: Settings2 },
  { value: "marketing", label: "Marketing", icon: Megaphone },
  { value: "creative", label: "Creative", icon: Palette },
  { value: "communication", label: "Communication", icon: Users2 },
]

const contentTypes = [
  {
    value: "sustainability-report",
    label: "Sustainability Report",
    icon: Leaf,
    description: "Detailed environmental impact and sustainability analysis.",
    category: "research",
  },
  {
    value: "performance-audit",
    label: "Performance Audit",
    icon: Zap,
    description: "In-depth website performance and optimization report.",
    category: "technical",
  },
  {
    value: "seo-strategy",
    label: "SEO Strategy Doc",
    icon: TrendingUp,
    description: "Actionable SEO improvement plan based on analysis.",
    category: "strategy",
  },
  {
    value: "blog-post-ideas",
    label: "Blog Post Ideas",
    icon: FileText,
    description: "Generate blog topics related to the website's niche.",
    category: "marketing",
  },
  {
    value: "social-media-campaign",
    label: "Social Media Campaign",
    icon: MessageSquare,
    description: "Outline a social media campaign strategy.",
    category: "marketing",
  },
  {
    value: "executive-summary",
    label: "Executive Summary",
    icon: BookOpen,
    description: "Concise overview of key findings for stakeholders.",
    category: "communication",
  },
  {
    value: "improvement-mindmap",
    label: "Improvement Mindmap",
    icon: MapPin,
    description: "Visual structure of recommended improvements.",
    category: "strategy",
  },
  {
    value: "green-hosting-pitch",
    label: "Green Hosting Pitch",
    icon: Globe,
    description: "Arguments for switching to sustainable hosting.",
    category: "communication",
  },
]

const toneOptions = [
  { value: "professional", label: "Professional" },
  { value: "technical", label: "Technical" },
  { value: "academic", label: "Academic" },
  { value: "casual", label: "Casual" },
  { value: "creative", label: "Creative" },
  { value: "informative", label: "Informative" },
  { value: "persuasive", label: "Persuasive" },
  { value: "concise", label: "Concise" },
]

export function EnhancedAIGenerator({ websiteData, onSignUpClick }: EnhancedAIGeneratorProps) {
  const [selectedType, setSelectedType] = useState(contentTypes[0].value)
  const [selectedTone, setSelectedTone] = useState(toneOptions[0].value)
  const [customPrompt, setCustomPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<AIContent | null>(null)
  const [contentHistory, setContentHistory] = useState<AIContent[]>([])
  const [activeTab, setActiveTab] = useState("generate")
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})
  const [selectedCategory, setSelectedCategory] = useState(contentCategories[0].value)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const savedHistory = localStorage.getItem("webinsight-ai-content-history")
    if (savedHistory) {
      try {
        setContentHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error("Error loading AI content history:", error)
      }
    }
  }, [])

  const saveToHistory = (content: AIContent) => {
    const updatedHistory = [content, ...contentHistory.slice(0, 19)]
    setContentHistory(updatedHistory)
    localStorage.setItem("webinsight-ai-content-history", JSON.stringify(updatedHistory))
  }

  const generateContent = async () => {
    if (!websiteData && !customPrompt.trim()) {
      toast({
        title: "Input Required",
        description: "Please analyze a website or provide a custom prompt.",
        variant: "destructive",
      })
      return
    }
    setIsGenerating(true)
    setGeneratedContent(null) // Clear previous result

    try {
      const payload = {
        websiteData: websiteData, // Send full websiteData
        contentType: selectedType,
        tone: selectedTone,
        customPrompt: customPrompt.trim(),
        analysisId: websiteData?._id,
      }

      const {
        success,
        data,
        error: fetchError,
      } = await safeFetch<{ success: boolean; content: AIContent }>("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        timeout: 60000, // 60 seconds for AI generation
      })

      if (!success || !data || !data.success || !data.content) {
        throw new Error(
          fetchError || data?.content?.toString() || "Failed to generate content or invalid response format.",
        )
      }

      const newContent: AIContent = {
        ...data.content,
        id: data.content.id || Date.now().toString(),
        type: selectedType,
        title:
          data.content.title ||
          `${contentTypes.find((t) => t.value === selectedType)?.label || "AI Content"} - ${new Date().toLocaleDateString()}`,
        createdAt: data.content.createdAt || new Date().toISOString(),
        websiteUrl: websiteData?.url,
        isFavorite: false,
      }

      setGeneratedContent(newContent)
      saveToHistory(newContent)
      setActiveTab("result")
      toast({ title: "AI Content Generated!", description: "Your AI-powered content is ready." })
    } catch (error: any) {
      console.error("Error generating AI content:", error)
      toast({
        title: "Generation Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string, format: "markdown" | "plain", contentId?: string) => {
    if (!isClient) return
    try {
      await navigator.clipboard.writeText(text)
      const key = `${contentId || "current"}-${format}`
      setCopiedStates((prev) => ({ ...prev, [key]: true }))
      setTimeout(() => setCopiedStates((prev) => ({ ...prev, [key]: false })), 2000)
      toast({ title: "Copied!", description: `Content copied as ${format}.` })
    } catch (error) {
      toast({ title: "Copy Failed", description: "Could not copy content.", variant: "destructive" })
    }
  }

  const shareViaEmail = (content: AIContent) => {
    if (!isClient) return
    const subject = encodeURIComponent(`AI Generated Content: ${content.title}`)
    const body = encodeURIComponent(
      `Title: ${content.title}\nWebsite: ${content.websiteUrl || "N/A"}\n\n${content.content}\n\nGenerated by WebInSight`,
    )
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const downloadContent = (content: AIContent, format: "txt" | "md") => {
    if (!isClient) return
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
    localStorage.setItem("webinsight-ai-content-history", JSON.stringify(updatedHistory))
    if (generatedContent?.id === contentId) {
      setGeneratedContent((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null))
    }
  }

  const filteredContentTypes = useMemo(() => {
    return contentTypes.filter((type) => type.category === selectedCategory)
  }, [selectedCategory])

  const ContentCardDisplay = ({ item, isActive = false }: { item: AIContent; isActive?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-slate-700/50 rounded-xl border p-5 space-y-3 ${isActive ? "border-blue-300 dark:border-blue-600 shadow-blue-100 dark:shadow-blue-900/30 shadow-md" : "border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500"} transition-all`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Badge
              variant="secondary"
              className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300"
            >
              {contentTypes.find((t) => t.value === item.type)?.label || item.type}
            </Badge>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{item.title}</h3>
          {item.websiteUrl && (
            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
              <ExternalLink className="w-3 h-3 inline mr-1" />
              {item.websiteUrl}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleFavorite(item.id)}
          className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 h-8 w-8"
        >
          <Heart
            className={`w-4 h-4 ${item.isFavorite ? "fill-red-500 text-red-500 dark:fill-red-600 dark:text-red-600" : ""}`}
          />
        </Button>
      </div>
      <div
        className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3 max-h-28 overflow-y-auto text-sm text-gray-700 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{
          __html: item.content.substring(0, 300).replace(/\n/g, "<br />") + (item.content.length > 300 ? "..." : ""),
        }}
      />
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-600">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(item.content, "plain", item.id)}
            className="text-xs"
          >
            <Copy className="w-3 h-3 mr-1" />
            {copiedStates[`${item.id}-plain`] ? "Copied!" : "Text"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(item.markdown, "markdown", item.id)}
            className="text-xs"
          >
            <Copy className="w-3 h-3 mr-1" />
            {copiedStates[`${item.id}-markdown`] ? "Copied!" : "MD"}
          </Button>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => shareViaEmail(item)} className="text-xs h-8 w-8">
            <Mail className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => downloadContent(item, "md")} className="text-xs h-8 w-8">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )

  if (!isClient) {
    // Basic SSR fallback
    return <div className="animate-pulse h-96 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-slate-700 rounded-xl p-1">
          <TabsTrigger
            value="generate"
            className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            <Brain className="w-4 h-4 mr-2" />
            Generate
          </TabsTrigger>
          <TabsTrigger
            value="result"
            disabled={!generatedContent}
            className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            Result
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            <Clock className="w-4 h-4 mr-2" />
            History ({contentHistory.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6 mt-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {contentCategories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className={
                    selectedCategory === category.value
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "dark:bg-slate-600 dark:hover:bg-slate-500"
                  }
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.label}
                </Button>
              )
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContentTypes.map((type) => {
              const Icon = type.icon
              return (
                <motion.div key={type.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    className={`cursor-pointer transition-all duration-200 h-full ${selectedType === type.value ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md" : "border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 hover:shadow-sm"}`}
                    onClick={() => setSelectedType(type.value)}
                  >
                    <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
                      <Icon
                        className={`w-8 h-8 mx-auto mb-2 ${selectedType === type.value ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}
                      />
                      <h3 className="font-semibold text-sm mb-1 text-gray-900 dark:text-gray-100">{type.label}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{type.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tone & Style</label>
            <div className="flex flex-wrap gap-2">
              {toneOptions.map((tone) => (
                <Button
                  key={tone.value}
                  variant={selectedTone === tone.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTone(tone.value)}
                  className={
                    selectedTone === tone.value
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "dark:bg-slate-600 dark:hover:bg-slate-500"
                  }
                >
                  {tone.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Instructions (Optional)
              </label>
              <Textarea
                placeholder="Add specific requirements, focus areas, target audience, or any other instructions..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[100px] resize-none dark:bg-slate-700 dark:text-gray-200 dark:placeholder-gray-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {websiteData ? (
                  <span className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-1" />
                    Using data from: {websiteData.url}
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400">
                    No website data - will use custom prompt only.
                  </span>
                )}
              </div>
              <Button
                onClick={generateContent}
                disabled={isGenerating || (!websiteData && !customPrompt.trim())}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all"
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

        <TabsContent value="result" className="space-y-6 mt-4">
          {generatedContent ? (
            <ContentCardDisplay item={generatedContent} isActive />
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">No content generated yet.</div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6 mt-4">
          {contentHistory.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Content History</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Generated content will appear here.</p>
              <Button
                onClick={() => setActiveTab("generate")}
                variant="outline"
                className="dark:text-gray-300 dark:border-slate-600 dark:hover:bg-slate-700"
              >
                Start Generating
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Content History</h3>
                <Badge variant="secondary">{contentHistory.length} items</Badge>
              </div>
              <div className="grid gap-4">
                {contentHistory.map((content) => (
                  <ContentCardDisplay key={content.id} item={content} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
