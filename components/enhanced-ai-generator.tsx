"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
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
  BarChart3,
  Target,
  Zap,
  Shield,
  TrendingUp,
  BookOpen,
  PenTool,
  Camera,
  Users,
  Briefcase,
  GraduationCap,
  Music,
  Video,
  Star,
  ChevronRight,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw,
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
  sections?: Array<{
    title: string
    content: string
    level: number
  }>
  wordCount?: number
  readingTime?: number
}

interface EnhancedAIGeneratorProps {
  websiteData?: WebsiteData | null
  onSignUpClick: () => void
}

const contentCategories = [
  {
    id: "research",
    name: "Research & Academic",
    icon: GraduationCap,
    color: "from-blue-500 to-indigo-600",
    types: [
      {
        value: "sustainability-research",
        label: "Sustainability Research",
        icon: TreePine,
        description: "Comprehensive environmental impact analysis with data and recommendations",
      },
      {
        value: "scholar-document",
        label: "Academic Paper",
        icon: BookOpen,
        description: "Scholarly research document with citations and methodology",
      },
      {
        value: "technical-audit",
        label: "Technical Audit",
        icon: Zap,
        description: "Detailed technical assessment with performance metrics",
      },
      {
        value: "case-study",
        label: "Case Study",
        icon: Target,
        description: "In-depth analysis of specific implementation or results",
      },
    ],
  },
  {
    id: "business",
    name: "Business & Strategy",
    icon: Briefcase,
    color: "from-green-500 to-emerald-600",
    types: [
      {
        value: "executive-summary",
        label: "Executive Summary",
        icon: Target,
        description: "High-level overview for decision makers and stakeholders",
      },
      {
        value: "business-proposal",
        label: "Business Proposal",
        icon: Briefcase,
        description: "Professional proposal with objectives and implementation plan",
      },
      {
        value: "market-analysis",
        label: "Market Analysis",
        icon: BarChart3,
        description: "Competitive landscape and market opportunity assessment",
      },
      {
        value: "roi-report",
        label: "ROI Report",
        icon: TrendingUp,
        description: "Return on investment analysis with financial projections",
      },
    ],
  },
  {
    id: "content",
    name: "Content Marketing",
    icon: PenTool,
    color: "from-purple-500 to-pink-600",
    types: [
      {
        value: "blog-post",
        label: "Blog Post",
        icon: FileText,
        description: "Engaging article optimized for SEO and reader engagement",
      },
      {
        value: "newsletter",
        label: "Newsletter",
        icon: Mail,
        description: "Email newsletter content with compelling subject lines",
      },
      {
        value: "press-release",
        label: "Press Release",
        icon: Megaphone,
        description: "Professional announcement for media distribution",
      },
      {
        value: "white-paper",
        label: "White Paper",
        icon: FileText,
        description: "Authoritative report on complex topics with solutions",
      },
    ],
  },
  {
    id: "social",
    name: "Social Media",
    icon: Users,
    color: "from-orange-500 to-red-600",
    types: [
      {
        value: "social-media-posts",
        label: "Social Media Posts",
        icon: MessageSquare,
        description: "Platform-specific posts for LinkedIn, Twitter, Facebook",
      },
      {
        value: "instagram-captions",
        label: "Instagram Captions",
        icon: Camera,
        description: "Engaging captions with hashtags and call-to-actions",
      },
      {
        value: "linkedin-article",
        label: "LinkedIn Article",
        icon: Users,
        description: "Professional thought leadership content for LinkedIn",
      },
      {
        value: "twitter-thread",
        label: "Twitter Thread",
        icon: MessageSquare,
        description: "Engaging multi-tweet thread with key insights",
      },
    ],
  },
  {
    id: "creative",
    name: "Creative Content",
    icon: Star,
    color: "from-pink-500 to-purple-600",
    types: [
      {
        value: "poetry",
        label: "Poetry",
        icon: PenTool,
        description: "Creative poems inspired by website analysis themes",
      },
      {
        value: "storytelling",
        label: "Brand Story",
        icon: BookOpen,
        description: "Compelling narrative about the brand or website",
      },
      {
        value: "video-script",
        label: "Video Script",
        icon: Video,
        description: "Script for promotional or educational videos",
      },
      {
        value: "podcast-outline",
        label: "Podcast Outline",
        icon: Music,
        description: "Structured outline for podcast episodes",
      },
    ],
  },
  {
    id: "technical",
    name: "Technical Documentation",
    icon: Shield,
    color: "from-cyan-500 to-blue-600",
    types: [
      {
        value: "api-documentation",
        label: "API Documentation",
        icon: Shield,
        description: "Technical documentation for developers",
      },
      {
        value: "user-guide",
        label: "User Guide",
        icon: BookOpen,
        description: "Step-by-step instructions for end users",
      },
      {
        value: "troubleshooting",
        label: "Troubleshooting Guide",
        icon: Zap,
        description: "Common issues and solutions documentation",
      },
      {
        value: "changelog",
        label: "Changelog",
        icon: Clock,
        description: "Version history and update documentation",
      },
    ],
  },
]

const toneOptions = [
  { value: "professional", label: "Professional", description: "Formal and business-appropriate" },
  { value: "technical", label: "Technical", description: "Detailed and precise for experts" },
  { value: "academic", label: "Academic", description: "Scholarly with citations and research" },
  { value: "casual", label: "Casual", description: "Friendly and conversational" },
  { value: "creative", label: "Creative", description: "Imaginative and engaging" },
  { value: "informative", label: "Informative", description: "Clear and educational" },
  { value: "persuasive", label: "Persuasive", description: "Compelling and action-oriented" },
  { value: "humorous", label: "Humorous", description: "Light-hearted and entertaining" },
]

export function EnhancedAIGenerator({ websiteData, onSignUpClick }: EnhancedAIGeneratorProps) {
  const [selectedCategory, setSelectedCategory] = useState("research")
  const [selectedType, setSelectedType] = useState("sustainability-research")
  const [selectedTone, setSelectedTone] = useState("professional")
  const [customPrompt, setCustomPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<AIContent | null>(null)
  const [contentHistory, setContentHistory] = useState<AIContent[]>([])
  const [activeTab, setActiveTab] = useState("generate")
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})
  const [showPreview, setShowPreview] = useState(true)
  const [generationError, setGenerationError] = useState<string | null>(null)

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
    const updatedHistory = [content, ...contentHistory.slice(0, 19)]
    setContentHistory(updatedHistory)
    localStorage.setItem("ai-content-history", JSON.stringify(updatedHistory))
  }

  // Update selected type when category changes
  useEffect(() => {
    const category = contentCategories.find((cat) => cat.id === selectedCategory)
    if (category && category.types.length > 0) {
      setSelectedType(category.types[0].value)
    }
  }, [selectedCategory])

  const generateContent = async () => {
    if (!websiteData && !customPrompt.trim()) {
      toast({
        title: "Input Required",
        description: "Please analyze a website first or provide a custom prompt.",
        variant: "destructive",
      })
      return
    }

    console.log("🚀 Starting content generation...")
    setIsGenerating(true)
    setGenerationError(null)
    setGeneratedContent(null)
    setActiveTab("result")

    try {
      const requestData = {
        websiteData,
        contentType: selectedType,
        tone: selectedTone,
        customPrompt: customPrompt.trim(),
        analysisId: websiteData?._id,
      }

      console.log("📤 Sending request:", {
        contentType: selectedType,
        tone: selectedTone,
        hasWebsiteData: !!websiteData,
        customPromptLength: customPrompt.length,
      })

      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      console.log("📥 Response status:", response.status)

      const responseText = await response.text()
      console.log("📄 Response text length:", responseText.length)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("❌ Failed to parse response:", parseError)
        throw new Error("Invalid response format from server")
      }

      console.log("📊 Parsed response:", {
        success: data.success,
        hasContent: !!data.content,
        error: data.error,
      })

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      if (!data.success || !data.content) {
        throw new Error(data.error || "Invalid response format from API")
      }

      const selectedTypeInfo = contentCategories.flatMap((cat) => cat.types).find((type) => type.value === selectedType)

      const newContent: AIContent = {
        id: data.content.id || Date.now().toString(),
        type: selectedType,
        title: data.content.title || selectedTypeInfo?.label || "Generated Content",
        content: data.content.content || "Content generation completed",
        markdown: data.content.markdown || data.content.content || "Content generation completed",
        createdAt: data.content.createdAt || new Date().toISOString(),
        websiteUrl: websiteData?.url,
        isFavorite: false,
        sections: data.content.sections || [],
        wordCount: data.content.wordCount || 0,
        readingTime: data.content.readingTime || 1,
      }

      console.log("✅ Content created:", {
        id: newContent.id,
        title: newContent.title,
        contentLength: newContent.content.length,
        sectionsCount: newContent.sections?.length || 0,
      })

      setGeneratedContent(newContent)
      saveToHistory(newContent)

      toast({
        title: "Content Generated!",
        description: `Your ${selectedTypeInfo?.label.toLowerCase() || "content"} is ready to use.`,
      })
    } catch (error: any) {
      console.error("💥 Content generation error:", error)
      setGenerationError(error.message || "Failed to generate content")

      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const retryGeneration = () => {
    setGenerationError(null)
    generateContent()
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
    const subject = encodeURIComponent(`Generated Content: ${content.title}`)
    const body = encodeURIComponent(`
Hi there!

I've generated content using AI. Here it is:

Title: ${content.title}
Type: ${content.type}
Generated: ${new Date(content.createdAt).toLocaleDateString()}
${content.websiteUrl ? `Website: ${content.websiteUrl}` : ""}

Content:
${content.content}

---
Generated with Website Analytics AI
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

  const getCurrentTypeInfo = () => {
    return contentCategories.flatMap((cat) => cat.types).find((type) => type.value === selectedType)
  }

  const ContentDisplay = ({ content }: { content: AIContent }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Content Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200"
            >
              {getCurrentTypeInfo()?.label || content.type}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {content.wordCount} words • {content.readingTime} min read
            </Badge>
            <span className="text-xs text-gray-500">{new Date(content.createdAt).toLocaleDateString()}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h2>
          {content.websiteUrl && (
            <p className="text-sm text-gray-600 flex items-center">
              <ExternalLink className="w-4 h-4 mr-1" />
              Based on analysis of: {content.websiteUrl}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="text-gray-500 hover:text-gray-700"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFavorite(content.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <Heart className={`w-4 h-4 ${content.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Content Body */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* Structured Content Display */}
            {content.sections && content.sections.length > 0 ? (
              <div className="space-y-6">
                {content.sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-3"
                  >
                    <h3
                      className={`font-semibold text-gray-900 ${
                        section.level === 1 ? "text-xl" : section.level === 2 ? "text-lg" : "text-base"
                      }`}
                    >
                      {section.title}
                    </h3>
                    <div className="prose prose-gray max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{section.content}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-6">
                  {content.content}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(content.content, "plain", content.id)}
            className="text-sm"
          >
            {copiedStates[`${content.id}-plain`] ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            Copy Text
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(content.markdown, "markdown", content.id)}
            className="text-sm"
          >
            {copiedStates[`${content.id}-markdown`] ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            Copy Markdown
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => shareViaEmail(content)} className="text-sm">
            <Mail className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="ghost" size="sm" onClick={() => downloadContent(content, "txt")} className="text-sm">
            <Download className="w-4 h-4 mr-2" />
            Download
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
          <TabsTrigger value="result" className="rounded-lg">
            <FileText className="w-4 h-4 mr-2" />
            Generated Content
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg">
            <Clock className="w-4 h-4 mr-2" />
            History ({contentHistory.length})
          </TabsTrigger>
        </TabsList>

        {/* Generate Tab */}
        <TabsContent value="generate" className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Choose Content Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentCategories.map((category) => {
                const Icon = category.icon
                return (
                  <motion.div key={category.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedCategory === category.id
                          ? "border-purple-500 bg-purple-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mx-auto mb-3`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{category.name}</h4>
                        <p className="text-xs text-gray-500">{category.types.length} types</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Specific Type Selection */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-800">
              Select {contentCategories.find((cat) => cat.id === selectedCategory)?.name} Type
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contentCategories
                .find((cat) => cat.id === selectedCategory)
                ?.types.map((type) => {
                  const Icon = type.icon
                  return (
                    <motion.div key={type.value} whileHover={{ scale: 1.01 }}>
                      <Card
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedType === type.value
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedType(type.value)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <Icon
                              className={`w-5 h-5 mt-0.5 ${
                                selectedType === type.value ? "text-blue-600" : "text-gray-600"
                              }`}
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-sm mb-1">{type.label}</h5>
                              <p className="text-xs text-gray-500">{type.description}</p>
                            </div>
                            {selectedType === type.value && <ChevronRight className="w-4 h-4 text-blue-600" />}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
            </div>
          </div>

          {/* Tone Selection */}
          <div className="space-y-3">
            <h4 className="text-md font-medium text-gray-800">Tone & Style</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {toneOptions.map((tone) => (
                <Button
                  key={tone.value}
                  variant={selectedTone === tone.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTone(tone.value)}
                  className={`text-xs ${selectedTone === tone.value ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                  title={tone.description}
                >
                  {tone.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Instructions */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Instructions (Optional)</label>
              <Textarea
                placeholder="Add specific requirements, target audience, key points to include, or any other instructions..."
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
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
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
          {/* Loading State */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <Loader2 className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Your Content</h3>
              <p className="text-gray-600">
                Creating {getCurrentTypeInfo()?.label.toLowerCase()} with {selectedTone} tone...
              </p>
            </motion.div>
          )}

          {/* Error State */}
          {generationError && !isGenerating && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Generation Failed</h3>
              <p className="text-gray-600 mb-4">{generationError}</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={retryGeneration} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={() => setActiveTab("generate")} variant="default">
                  Back to Generator
                </Button>
              </div>
            </motion.div>
          )}

          {/* Generated Content */}
          {generatedContent && !isGenerating && !generationError && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <CardContent className="p-6">
                  <ContentDisplay content={generatedContent} />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Empty State */}
          {!generatedContent && !isGenerating && !generationError && (
            <div className="text-center py-12">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content Generated Yet</h3>
              <p className="text-gray-600 mb-4">Generate your first piece of content to see it here.</p>
              <Button onClick={() => setActiveTab("generate")} variant="outline">
                Start Generating
              </Button>
            </div>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          {contentHistory.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content History</h3>
              <p className="text-gray-600 mb-4">Your generated content will appear here.</p>
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

              <div className="space-y-4">
                {contentHistory.map((content) => (
                  <Card key={content.id} className="border-gray-200 hover:border-gray-300 transition-colors">
                    <CardContent className="p-6">
                      <ContentDisplay content={content} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
