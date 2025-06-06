"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
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
  Palette,
  Type,
  Feather,
  Mic,
  Smile,
  Lightbulb,
  Award,
  Globe,
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
  summary?: string
  keyPoints?: string[]
  tone?: string
  writingStyle?: string
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
        recommendedTones: ["academic", "professional", "technical"],
        recommendedStyles: ["analytical", "scientific", "formal"],
      },
      {
        value: "scholar-document",
        label: "Academic Paper",
        icon: BookOpen,
        description: "Scholarly research document with citations and methodology",
        recommendedTones: ["academic", "professional", "technical"],
        recommendedStyles: ["analytical", "scientific", "formal"],
      },
      {
        value: "technical-audit",
        label: "Technical Audit",
        icon: Zap,
        description: "Detailed technical assessment with performance metrics",
        recommendedTones: ["technical", "professional", "analytical"],
        recommendedStyles: ["technical", "analytical", "detailed"],
      },
      {
        value: "case-study",
        label: "Case Study",
        icon: Target,
        description: "In-depth analysis of specific implementation or results",
        recommendedTones: ["professional", "analytical", "informative"],
        recommendedStyles: ["narrative", "analytical", "detailed"],
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
        recommendedTones: ["professional", "authoritative", "concise"],
        recommendedStyles: ["executive", "strategic", "formal"],
      },
      {
        value: "business-proposal",
        label: "Business Proposal",
        icon: Briefcase,
        description: "Professional proposal with objectives and implementation plan",
        recommendedTones: ["professional", "persuasive", "confident"],
        recommendedStyles: ["persuasive", "strategic", "formal"],
      },
      {
        value: "market-analysis",
        label: "Market Analysis",
        icon: BarChart3,
        description: "Competitive landscape and market opportunity assessment",
        recommendedTones: ["analytical", "professional", "informative"],
        recommendedStyles: ["analytical", "detailed", "strategic"],
      },
      {
        value: "roi-report",
        label: "ROI Report",
        icon: TrendingUp,
        description: "Return on investment analysis with financial projections",
        recommendedTones: ["professional", "analytical", "data-driven"],
        recommendedStyles: ["analytical", "detailed", "technical"],
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
        recommendedTones: ["conversational", "informative", "engaging"],
        recommendedStyles: ["engaging", "accessible", "storytelling"],
      },
      {
        value: "newsletter",
        label: "Newsletter",
        icon: Mail,
        description: "Email newsletter content with compelling subject lines",
        recommendedTones: ["friendly", "conversational", "engaging"],
        recommendedStyles: ["engaging", "accessible", "personal"],
      },
      {
        value: "press-release",
        label: "Press Release",
        icon: Megaphone,
        description: "Professional announcement for media distribution",
        recommendedTones: ["professional", "newsworthy", "authoritative"],
        recommendedStyles: ["journalistic", "formal", "concise"],
      },
      {
        value: "white-paper",
        label: "White Paper",
        icon: FileText,
        description: "Authoritative report on complex topics with solutions",
        recommendedTones: ["authoritative", "professional", "educational"],
        recommendedStyles: ["authoritative", "detailed", "educational"],
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
        recommendedTones: ["engaging", "conversational", "trendy"],
        recommendedStyles: ["engaging", "concise", "viral"],
      },
      {
        value: "instagram-captions",
        label: "Instagram Captions",
        icon: Camera,
        description: "Engaging captions with hashtags and call-to-actions",
        recommendedTones: ["trendy", "engaging", "inspirational"],
        recommendedStyles: ["visual", "engaging", "trendy"],
      },
      {
        value: "linkedin-article",
        label: "LinkedIn Article",
        icon: Users,
        description: "Professional thought leadership content for LinkedIn",
        recommendedTones: ["professional", "thought-leadership", "insightful"],
        recommendedStyles: ["professional", "thought-leadership", "engaging"],
      },
      {
        value: "twitter-thread",
        label: "Twitter Thread",
        icon: MessageSquare,
        description: "Engaging multi-tweet thread with key insights",
        recommendedTones: ["conversational", "insightful", "engaging"],
        recommendedStyles: ["concise", "engaging", "viral"],
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
        recommendedTones: ["creative", "artistic", "expressive"],
        recommendedStyles: ["creative", "artistic", "expressive"],
      },
      {
        value: "storytelling",
        label: "Brand Story",
        icon: BookOpen,
        description: "Compelling narrative about the brand or website",
        recommendedTones: ["narrative", "emotional", "inspiring"],
        recommendedStyles: ["storytelling", "narrative", "emotional"],
      },
      {
        value: "video-script",
        label: "Video Script",
        icon: Video,
        description: "Script for promotional or educational videos",
        recommendedTones: ["engaging", "conversational", "dynamic"],
        recommendedStyles: ["visual", "engaging", "dynamic"],
      },
      {
        value: "podcast-outline",
        label: "Podcast Outline",
        icon: Music,
        description: "Structured outline for podcast episodes",
        recommendedTones: ["conversational", "engaging", "informative"],
        recommendedStyles: ["conversational", "structured", "engaging"],
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
        recommendedTones: ["technical", "precise", "clear"],
        recommendedStyles: ["technical", "detailed", "structured"],
      },
      {
        value: "user-guide",
        label: "User Guide",
        icon: BookOpen,
        description: "Step-by-step instructions for end users",
        recommendedTones: ["helpful", "clear", "instructional"],
        recommendedStyles: ["instructional", "accessible", "step-by-step"],
      },
      {
        value: "troubleshooting",
        label: "Troubleshooting Guide",
        icon: Zap,
        description: "Common issues and solutions documentation",
        recommendedTones: ["helpful", "solution-focused", "clear"],
        recommendedStyles: ["problem-solving", "structured", "clear"],
      },
      {
        value: "changelog",
        label: "Changelog",
        icon: Clock,
        description: "Version history and update documentation",
        recommendedTones: ["informative", "technical", "concise"],
        recommendedStyles: ["technical", "chronological", "concise"],
      },
    ],
  },
]

const toneOptions = [
  {
    value: "professional",
    label: "Professional",
    icon: Briefcase,
    description: "Formal, business-appropriate tone suitable for corporate communications",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    value: "academic",
    label: "Academic",
    icon: GraduationCap,
    description: "Scholarly tone with citations, research-focused language",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    value: "technical",
    label: "Technical",
    icon: Zap,
    description: "Detailed, precise language for technical audiences",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
  {
    value: "conversational",
    label: "Conversational",
    icon: MessageSquare,
    description: "Friendly, approachable tone for general audiences",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  {
    value: "creative",
    label: "Creative",
    icon: Palette,
    description: "Imaginative, artistic expression with creative flair",
    color: "bg-pink-100 text-pink-800 border-pink-200",
  },
  {
    value: "persuasive",
    label: "Persuasive",
    icon: Target,
    description: "Compelling, action-oriented language to drive decisions",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  {
    value: "informative",
    label: "Informative",
    icon: BookOpen,
    description: "Clear, educational content focused on knowledge transfer",
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
  {
    value: "engaging",
    label: "Engaging",
    icon: Star,
    description: "Captivating, attention-grabbing style for audience retention",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  {
    value: "authoritative",
    label: "Authoritative",
    icon: Award,
    description: "Expert, confident tone establishing credibility and trust",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  {
    value: "humorous",
    label: "Humorous",
    icon: Smile,
    description: "Light-hearted, entertaining approach with wit and humor",
    color: "bg-rose-100 text-rose-800 border-rose-200",
  },
]

const writingStyleOptions = [
  {
    value: "analytical",
    label: "Analytical",
    icon: BarChart3,
    description: "Data-driven approach with logical structure and evidence-based conclusions",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    value: "narrative",
    label: "Narrative",
    icon: BookOpen,
    description: "Story-driven format with clear beginning, middle, and end",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    value: "instructional",
    label: "Instructional",
    icon: Target,
    description: "Step-by-step guidance with clear actions and outcomes",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  {
    value: "persuasive",
    label: "Persuasive",
    icon: Lightbulb,
    description: "Argument-based structure designed to convince and motivate",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  {
    value: "descriptive",
    label: "Descriptive",
    icon: Eye,
    description: "Detailed, vivid descriptions that paint a clear picture",
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
  {
    value: "conversational",
    label: "Conversational",
    icon: MessageSquare,
    description: "Natural, dialogue-like flow as if speaking directly to reader",
    color: "bg-pink-100 text-pink-800 border-pink-200",
  },
  {
    value: "formal",
    label: "Formal",
    icon: Shield,
    description: "Traditional academic or business writing with proper structure",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
  {
    value: "creative",
    label: "Creative",
    icon: Palette,
    description: "Artistic expression with unique perspectives and innovative approaches",
    color: "bg-rose-100 text-rose-800 border-rose-200",
  },
  {
    value: "technical",
    label: "Technical",
    icon: Zap,
    description: "Precise, specification-focused writing for technical documentation",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
  {
    value: "journalistic",
    label: "Journalistic",
    icon: Globe,
    description: "News-style writing with who, what, when, where, why structure",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
]

export function EnhancedAIGenerator({ websiteData, onSignUpClick }: EnhancedAIGeneratorProps) {
  const [selectedCategory, setSelectedCategory] = useState("research")
  const [selectedType, setSelectedType] = useState("sustainability-research")
  const [selectedTone, setSelectedTone] = useState("professional")
  const [selectedWritingStyle, setSelectedWritingStyle] = useState("analytical")
  const [customPrompt, setCustomPrompt] = useState("")
  const [contentStructure, setContentStructure] = useState("")
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

  // Auto-suggest tone and style based on content type
  useEffect(() => {
    const currentType = contentCategories.flatMap((cat) => cat.types).find((type) => type.value === selectedType)

    if (currentType?.recommendedTones?.length > 0) {
      setSelectedTone(currentType.recommendedTones[0])
    }

    if (currentType?.recommendedStyles?.length > 0) {
      setSelectedWritingStyle(currentType.recommendedStyles[0])
    }
  }, [selectedType])

  const generateContent = async () => {
    if (!websiteData && !customPrompt.trim() && !contentStructure.trim()) {
      toast({
        title: "Input Required",
        description: "Please analyze a website, provide a custom prompt, or define a content structure.",
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
        writingStyle: selectedWritingStyle,
        customPrompt: customPrompt.trim(),
        contentStructure: contentStructure.trim(),
        analysisId: websiteData?._id,
      }

      console.log("📤 Sending request:", {
        contentType: selectedType,
        tone: selectedTone,
        writingStyle: selectedWritingStyle,
        hasWebsiteData: !!websiteData,
        customPromptLength: customPrompt.length,
        contentStructureLength: contentStructure.length,
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
        summary: data.content.summary || "",
        keyPoints: data.content.keyPoints || [],
        tone: selectedTone,
        writingStyle: selectedWritingStyle,
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
Tone: ${content.tone}
Writing Style: ${content.writingStyle}
Generated: ${new Date(content.createdAt).toLocaleDateString()}
${content.websiteUrl ? `Website: ${content.websiteUrl}` : ""}

Content:
${content.content}

---
Generated with WebInSight AI
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

  const getRecommendedOptions = () => {
    const currentType = getCurrentTypeInfo()
    return {
      tones: currentType?.recommendedTones || [],
      styles: currentType?.recommendedStyles || [],
    }
  }

  const ContentDisplay = ({ content }: { content: AIContent }) => (
    <div className="space-y-6">
      {/* Enhanced Content Header */}
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
            <Badge variant="outline" className="text-xs">
              {content.sections?.length || 0} sections
            </Badge>
            {content.tone && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                {content.tone}
              </Badge>
            )}
            {content.writingStyle && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                {content.writingStyle}
              </Badge>
            )}
            <span className="text-xs text-gray-500">{new Date(content.createdAt).toLocaleDateString()}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h2>
          {(websiteData?.title || websiteData?.url) && (
            <p className="text-sm text-gray-600 flex items-center mb-4">
              <ExternalLink className="w-4 h-4 mr-1" />
              Based on analysis of: {websiteData?.title || websiteData?.url}
            </p>
          )}

          {/* Content Summary */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <h4 className="font-semibold text-blue-900 mb-2">Executive Summary</h4>
            <p className="text-blue-800 text-sm leading-relaxed">
              {content.summary || "Professional analysis completed with comprehensive insights."}
            </p>
          </div>

          {/* Key Points */}
          {content.keyPoints && content.keyPoints.length > 0 && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
              <h4 className="font-semibold text-green-900 mb-2">Key Insights</h4>
              <ul className="text-green-800 text-sm space-y-1">
                {content.keyPoints.slice(0, 6).map((point, index) => (
                  <li key={`point-${index}`} className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
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

      {/* Enhanced Content Body */}
      {showPreview && (
        <div className="space-y-6">
          {/* Table of Contents for longer documents */}
          {content.sections && content.sections.length > 3 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Table of Contents</h4>
              <ul className="space-y-1">
                {content.sections.map((section, index) => (
                  <li key={`toc-${index}`} className="flex items-center text-sm">
                    <span className="text-gray-400 mr-2">{"  ".repeat(section.level - 1)}•</span>
                    <span className="text-gray-700 hover:text-blue-600 cursor-pointer">{section.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Content Display */}
          <div className="max-h-none overflow-visible">
            {content.sections && content.sections.length > 0 ? (
              <div className="space-y-8">
                {content.sections.map((section, index) => (
                  <div key={`section-${index}`} className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <h3
                        className={`font-semibold text-gray-900 ${
                          section.level === 1 ? "text-2xl" : section.level === 2 ? "text-xl" : "text-lg"
                        }`}
                      >
                        {section.title}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        Level {section.level}
                      </Badge>
                    </div>
                    <div className="prose prose-gray max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-white border border-gray-200 rounded-lg p-6">
                        {section.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-6 border border-gray-200">
                  {content.content}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-100">
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(JSON.stringify(content.sections, null, 2), "plain", content.id)}
            className="text-sm"
          >
            <FileText className="w-4 h-4 mr-2" />
            Copy Structure
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => shareViaEmail(content)} className="text-sm">
            <Mail className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="ghost" size="sm" onClick={() => downloadContent(content, "txt")} className="text-sm">
            <Download className="w-4 h-4 mr-2" />
            Download TXT
          </Button>
          <Button variant="ghost" size="sm" onClick={() => downloadContent(content, "md")} className="text-sm">
            <Download className="w-4 h-4 mr-2" />
            Download MD
          </Button>
        </div>
      </div>
    </div>
  )

  const recommended = getRecommendedOptions()

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
        <TabsContent value="generate" className="space-y-8">
          {/* Content Type Selection */}
          <Card className="border-2 border-dashed border-gray-200 hover:border-purple-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <span>Choose Content Type</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contentCategories.map((category) => {
                  const Icon = category.icon
                  return (
                    <Card
                      key={category.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
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
                  )
                })}
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
                        <Card
                          key={type.value}
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
                      )
                    })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tone & Writing Style Selection */}
          <Card className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-blue-600" />
                <span>Tone & Writing Style</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tone Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-md font-medium text-gray-800 flex items-center space-x-2">
                    <Mic className="w-4 h-4" />
                    <span>Tone</span>
                  </Label>
                  {recommended.tones.length > 0 && (
                    <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                      Recommended for {getCurrentTypeInfo()?.label}
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {toneOptions.map((tone) => {
                    const Icon = tone.icon
                    const isRecommended = recommended.tones.includes(tone.value)
                    return (
                      <Card
                        key={tone.value}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedTone === tone.value
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : isRecommended
                              ? "border-yellow-300 bg-yellow-50 hover:border-yellow-400"
                              : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedTone(tone.value)}
                      >
                        <CardContent className="p-3 text-center">
                          <Icon
                            className={`w-5 h-5 mx-auto mb-2 ${
                              selectedTone === tone.value
                                ? "text-blue-600"
                                : isRecommended
                                  ? "text-yellow-600"
                                  : "text-gray-600"
                            }`}
                          />
                          <h5 className="font-medium text-xs mb-1">{tone.label}</h5>
                          {isRecommended && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-yellow-100 text-yellow-700 border-yellow-300"
                            >
                              Recommended
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
                <p className="text-sm text-gray-600">
                  {toneOptions.find((t) => t.value === selectedTone)?.description}
                </p>
              </div>

              {/* Writing Style Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-md font-medium text-gray-800 flex items-center space-x-2">
                    <Type className="w-4 h-4" />
                    <span>Writing Style</span>
                  </Label>
                  {recommended.styles.length > 0 && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Recommended for {getCurrentTypeInfo()?.label}
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {writingStyleOptions.map((style) => {
                    const Icon = style.icon
                    const isRecommended = recommended.styles.includes(style.value)
                    return (
                      <Card
                        key={style.value}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedWritingStyle === style.value
                            ? "border-green-500 bg-green-50 shadow-sm"
                            : isRecommended
                              ? "border-green-300 bg-green-50 hover:border-green-400"
                              : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedWritingStyle(style.value)}
                      >
                        <CardContent className="p-3 text-center">
                          <Icon
                            className={`w-5 h-5 mx-auto mb-2 ${
                              selectedWritingStyle === style.value
                                ? "text-green-600"
                                : isRecommended
                                  ? "text-green-600"
                                  : "text-gray-600"
                            }`}
                          />
                          <h5 className="font-medium text-xs mb-1">{style.label}</h5>
                          {isRecommended && (
                            <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                              Recommended
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
                <p className="text-sm text-gray-600">
                  {writingStyleOptions.find((s) => s.value === selectedWritingStyle)?.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Custom Instructions */}
          <Card className="border-2 border-dashed border-gray-200 hover:border-green-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Feather className="w-5 h-5 text-green-600" />
                <span>Custom Instructions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Custom Prompt (Optional)</Label>
                <Textarea
                  placeholder="Add specific requirements, target audience, key points to include, or any other instructions..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Structure Template (Optional)
                </Label>
                <Textarea
                  placeholder={`Define the exact structure for your content. Example:
# Main Title
## Section 1
### Subsection 1.1
Content for subsection 1.1
## Section 2
Content for section 2`}
                  value={contentStructure}
                  onChange={(e) => setContentStructure(e.target.value)}
                  className="min-h-[150px] resize-none font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">If provided, the AI will follow this structure exactly.</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {websiteData ? (
                    <span className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-1" />
                      Website data available: {websiteData.url}
                    </span>
                  ) : (
                    <span className="text-amber-600">No website data - will use custom prompt/structure only</span>
                  )}
                </div>

                <Button
                  onClick={generateContent}
                  disabled={isGenerating || (!websiteData && !customPrompt.trim() && !contentStructure.trim())}
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Result Tab */}
        <TabsContent value="result" className="space-y-6">
          {/* Loading State */}
          {isGenerating && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-purple-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Your Content</h3>
              <p className="text-gray-600">
                Creating {getCurrentTypeInfo()?.label.toLowerCase() || "content"} with {selectedTone} tone and{" "}
                {selectedWritingStyle} style...
              </p>
            </div>
          )}

          {/* Error State */}
          {generationError && !isGenerating && (
            <div className="text-center py-12">
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
            </div>
          )}

          {/* Generated Content */}
          {generatedContent && !isGenerating && !generationError && (
            <div>
              <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <CardContent className="p-6">
                  <ContentDisplay content={generatedContent} />
                </CardContent>
              </Card>
            </div>
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
