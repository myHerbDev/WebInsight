"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  FileText,
  FileType,
  Loader2,
  MessageSquare,
  Newspaper,
  Search,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Save,
  History,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { ContentExport } from "@/components/content-export"

interface ContentTypeGeneratorProps {
  analysisId: string
  tone: string
  onSignUpClick: () => void
}

interface SavedContent {
  id: string
  type: string
  content: string
  analysisId: string
  timestamp: number
  analysisData?: any
}

export function ContentTypeGenerator({ analysisId, tone, onSignUpClick }: ContentTypeGeneratorProps) {
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentType, setCurrentType] = useState("research")
  const [generatedContentId, setGeneratedContentId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [savedContents, setSavedContents] = useState<SavedContent[]>([])
  const [analysisData, setAnalysisData] = useState<any>(null)

  const contentTypes = [
    {
      id: "research",
      label: "Research",
      icon: Search,
      description: "Comprehensive research report with analysis and insights",
    },
    {
      id: "document",
      label: "Document",
      icon: FileText,
      description: "Formal document with structured findings",
    },
    {
      id: "blog",
      label: "Blog",
      icon: FileType,
      description: "Engaging blog post about the website analysis",
    },
    {
      id: "marketing",
      label: "Marketing",
      icon: Newspaper,
      description: "Marketing strategy and campaign recommendations",
    },
    {
      id: "social",
      label: "Social",
      icon: MessageSquare,
      description: "Social media content for multiple platforms",
    },
  ]

  // Load saved content and analysis data on component mount
  useEffect(() => {
    loadSavedContents()
    loadAnalysisData()
  }, [analysisId])

  // Auto-save content when it changes
  useEffect(() => {
    if (generatedContent && currentType) {
      saveContentToStorage()
    }
  }, [generatedContent, currentType, analysisId])

  const loadSavedContents = () => {
    try {
      const saved = localStorage.getItem(`webinsight-contents-${analysisId}`)
      if (saved) {
        const contents = JSON.parse(saved)
        setSavedContents(contents)

        // Load the current type's content if it exists
        const currentContent = contents.find((c: SavedContent) => c.type === currentType)
        if (currentContent) {
          setGeneratedContent(currentContent.content)
        }
      }
    } catch (error) {
      console.error("Error loading saved contents:", error)
    }
  }

  const loadAnalysisData = async () => {
    try {
      // In a real implementation, you'd fetch this from your API
      // For now, we'll use localStorage if available
      const analysis = localStorage.getItem(`webinsight-analysis-${analysisId}`)
      if (analysis) {
        setAnalysisData(JSON.parse(analysis))
      }
    } catch (error) {
      console.error("Error loading analysis data:", error)
    }
  }

  const saveContentToStorage = () => {
    try {
      const existingContents = savedContents.filter((c) => !(c.analysisId === analysisId && c.type === currentType))
      const newContent: SavedContent = {
        id: `${analysisId}-${currentType}-${Date.now()}`,
        type: currentType,
        content: generatedContent,
        analysisId,
        timestamp: Date.now(),
        analysisData,
      }

      const updatedContents = [...existingContents, newContent]
      setSavedContents(updatedContents)
      localStorage.setItem(`webinsight-contents-${analysisId}`, JSON.stringify(updatedContents))
    } catch (error) {
      console.error("Error saving content:", error)
    }
  }

  const loadContentForType = (type: string) => {
    const savedContent = savedContents.find((c) => c.type === type && c.analysisId === analysisId)
    if (savedContent) {
      setGeneratedContent(savedContent.content)
    } else {
      setGeneratedContent("")
    }
    setCurrentType(type)
    setError(null)
    setSuccess(null)
  }

  const handleGenerate = async (type: string) => {
    setIsGenerating(true)
    setGeneratedContent("")
    setCurrentType(type)
    setError(null)
    setSuccess(null)

    try {
      console.log(`Generating ${type} content for analysis ${analysisId}`)

      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysisId,
          contentType: type,
          tone,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to generate content")
      }

      if (data.content) {
        setGeneratedContent(data.content)
        if (data.contentId) {
          setGeneratedContentId(data.contentId)
        }
        setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} content generated successfully!`)

        toast({
          title: "✨ Content Generated",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} content has been created and saved automatically.`,
        })
      } else {
        throw new Error("No content received from the server")
      }
    } catch (error) {
      console.error("Error generating content:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to generate content. Please try again."
      setError(errorMessage)

      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const selectedContentType = contentTypes.find((ct) => ct.id === currentType)
  const currentSavedContent = savedContents.find((c) => c.type === currentType && c.analysisId === analysisId)

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-teal-500 rounded-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          AI Content Generator
        </CardTitle>
        <CardDescription className="text-lg">
          Generate different types of content based on the website analysis using advanced AI. Content is automatically
          saved and persists across sessions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={currentType} onValueChange={loadContentForType}>
          <TabsList className="grid grid-cols-5 mb-6 bg-white/50 dark:bg-gray-800/50">
            {contentTypes.map((type) => {
              const Icon = type.icon
              const hasSavedContent = savedContents.some((c) => c.type === type.id && c.analysisId === analysisId)

              return (
                <TabsTrigger key={type.id} value={type.id} className="flex flex-col gap-1 h-auto py-4 relative">
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{type.label}</span>
                  {hasSavedContent && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white">
                      <Save className="h-2 w-2 text-white" />
                    </div>
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {contentTypes.map((type) => (
            <TabsContent key={type.id} value={type.id} className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold capitalize mb-2 bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                    {type.label} Content
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{type.description}</p>

                  {currentSavedContent && (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mb-4">
                      <History className="h-4 w-4" />
                      <span>Last saved: {new Date(currentSavedContent.timestamp).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleGenerate(type.id)}
                  disabled={isGenerating}
                  className="ml-4 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white px-6 py-3 text-lg shadow-lg"
                >
                  {isGenerating && currentType === type.id ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <type.icon className="h-5 w-5 mr-2" />
                      Generate {type.label}
                    </>
                  )}
                </Button>
              </div>

              {/* Status Messages */}
              {error && currentType === type.id && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && currentType === type.id && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Loading State */}
              {isGenerating && currentType === type.id && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto"></div>
                      <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                      ✨ Generating magical {type.label.toLowerCase()} content...
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Analyzing website data and crafting personalized content
                    </p>
                  </div>
                </div>
              )}

              {/* Content Display */}
              <Textarea
                value={generatedContent}
                readOnly
                placeholder={`Your generated ${type.label.toLowerCase()} content will appear here and be automatically saved...`}
                className="min-h-[500px] font-mono text-sm border-purple-200 focus:border-purple-500 bg-white/70 dark:bg-gray-800/70"
              />

              {/* Export Component */}
              {generatedContent && (
                <ContentExport
                  content={generatedContent}
                  contentType={type.id}
                  analysisData={analysisData}
                  withMarkdown={true}
                />
              )}

              {/* Upgrade CTA */}
              {generatedContent && (
                <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-white/20 rounded-full">
                        <Sparkles className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold mb-2">Unlock Premium Features</h4>
                      <p className="text-purple-100 mb-4">
                        Save unlimited content, export to multiple formats, access advanced AI models, and enjoy
                        priority support with a WebInSight account.
                      </p>
                      <Button
                        onClick={onSignUpClick}
                        className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
                      >
                        Upgrade Now - It's Free!
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Enhanced Help Section */}
        <div className="mt-8 p-6 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-purple-200">
          <h4 className="font-semibold mb-4 text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />✨ Magical Content Generation Tips
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                Research reports provide comprehensive analysis with actionable insights
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                Blog posts are engaging and optimized for content marketing
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                Marketing content focuses on strategy and growth opportunities
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-teal-500">•</span>
                Social media content is platform-optimized and shareable
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500">•</span>
                All content is based on real analysis data from your website
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500">•</span>
                Content is automatically saved and accessible across sessions
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
